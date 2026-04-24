'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, Dumbbell, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarContent } from './SidebarContent'
import { Conversation, Project } from '../../types'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  conversations: Conversation[]
  activeConversationId: string | null
  isLoading?: boolean
  error?: string | null
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, title: string) => void
  projects: Project[]
  onToggleProject: (id: string) => void
  onDeleteProject: (id: string) => void
  onRenameProject: (id: string, name: string) => void
  onChangeProjectIcon: (id: string, icon: string) => void
  onCreateProject: (name: string, icon: string) => void
  onMoveConversation: (conversationId: string, projectId: string | null) => void
}

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  isActive?: boolean
  children?: { label: string; href: string }[]
}

export function Sidebar({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  isLoading,
  error,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  projects,
  onToggleProject,
  onDeleteProject,
  onRenameProject,
  onChangeProjectIcon,
  onCreateProject,
  onMoveConversation,
}: SidebarProps) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/chat',
      icon: <Home className="h-5 w-5" />,
      isActive: pathname === '/chat',
    },
    {
      id: 'progress',
      label: 'Progresso',
      href: '/training',
      icon: <BarChart3 className="h-5 w-5" />,
      isActive: pathname === '/training',
    },
    {
      id: 'activities',
      label: 'Atividades',
      href: '/training/history',
      icon: <Dumbbell className="h-5 w-5" />,
      isActive: pathname?.startsWith('/training/history'),
    },
  ]

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-[280px] bg-background z-50 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Close button */}
          <div className="flex items-center justify-end p-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-foreground-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-1">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      item.isActive
                        ? 'text-accent font-medium'
                        : 'text-foreground hover:bg-background-secondary'
                    )}
                  >
                    <span className={item.isActive ? 'text-accent' : 'text-foreground-muted'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Projects + Conversations */}
          <SidebarContent
          conversations={conversations}
          activeConversationId={activeConversationId}
          isLoading={isLoading}
          error={error}
          onSelectConversation={(id) => {
            onSelectConversation(id)
            onClose()
          }}
          onDeleteConversation={onDeleteConversation}
          onRenameConversation={onRenameConversation}
          projects={projects}
          onToggleProject={onToggleProject}
          onDeleteProject={onDeleteProject}
          onRenameProject={onRenameProject}
          onChangeProjectIcon={onChangeProjectIcon}
          onCreateProject={onCreateProject}
          onMoveConversation={onMoveConversation}
        />
        </div>

        {/* Footer — Configurações */}
        <div className="p-3">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground-muted hover:bg-background-secondary hover:text-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
            Configurações
          </Link>
        </div>
      </aside>
    </>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, BarChart3, Dumbbell, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SidebarContent } from './SidebarContent'
import { Conversation, Project } from '../../types'
import { cn } from '@/lib/utils'
import { useUserProfile } from '@/shared/hooks/useUserProfile'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  conversations: Conversation[]
  activeConversationId: string | null
  isLoading?: boolean
  isLoadingMore?: boolean
  hasMore?: boolean
  error?: string | null
  onNewConversation: () => void
  onLoadMore?: () => void
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
  isLoadingMore,
  hasMore,
  error,
  onNewConversation,
  onLoadMore,
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
  const { name, avatarUrl, plan, tier } = useUserProfile()

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Chat',
      href: '/chat',
      icon: <MessageSquare className="h-5 w-5" />,
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
      {/* Overlay — mobile only */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar: drawer on mobile, fixed on desktop */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-[75vw] max-w-[280px] bg-background z-50 flex flex-col',
          'transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto lg:border-r lg:border-border',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header with close button */}
          <div className="flex items-center justify-end p-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-foreground-muted hover:text-foreground lg:hidden"
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
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={error}
          onLoadMore={onLoadMore}
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

        {/* Footer — User Profile */}
        <div className="border-t border-border p-3">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-background-secondary transition-colors"
          >
            <div className="relative h-10 w-10 shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-foreground" />
              <Avatar className="absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] border-2 border-background">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{name}</p>
              {tier === 'pro' ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00F048]/15 text-[#00F048]">Pro</span>
              ) : tier === 'premium' ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-400">Premium</span>
              ) : (
                <p className="text-xs text-foreground-muted">{plan}</p>
              )}
            </div>
            <Settings className="h-4 w-4 text-foreground-muted shrink-0" />
          </Link>
        </div>
      </aside>
    </>
  )
}

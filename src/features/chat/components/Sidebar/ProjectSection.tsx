'use client'

import { useState } from 'react'
import { Plus, ChevronDown } from 'lucide-react'
import { Project, Conversation } from '../../types'
import { ProjectItem } from './ProjectItem'
import { CreateProjectModal } from './CreateProjectModal'

interface ProjectSectionProps {
  projects: Project[]
  conversations: Conversation[]
  activeConversationId: string | null
  onToggleProject: (id: string) => void
  onDeleteProject: (id: string) => void
  onRenameProject: (id: string, name: string) => void
  onChangeProjectIcon: (id: string, icon: string) => void
  onCreateProject: (name: string, icon: string) => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, title: string) => void
  onMoveConversation: (conversationId: string, projectId: string | null) => void
}

const MAX_VISIBLE = 3

export function ProjectSection({
  projects,
  conversations,
  activeConversationId,
  onToggleProject,
  onDeleteProject,
  onRenameProject,
  onChangeProjectIcon,
  onCreateProject,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onMoveConversation,
}: ProjectSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const visibleProjects = showAll ? projects : projects.slice(0, MAX_VISIBLE)
  const remaining = projects.length - MAX_VISIBLE

  const handleEditSubmit = (name: string, icon: string) => {
    if (editingProject) {
      onRenameProject(editingProject.id, name)
      onChangeProjectIcon(editingProject.id, icon)
      setEditingProject(null)
    }
  }

  return (
    <div className="mb-2">
      {/* Section header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-sm font-medium text-foreground-muted">
          Projetos
        </span>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-0.5 rounded hover:bg-background-secondary text-foreground-muted hover:text-foreground transition-colors"
          title="Novo projeto"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Project list */}
      {projects.length === 0 ? (
        <div className="px-3 py-2 text-xs text-foreground-muted">
          Nenhum projeto ainda
        </div>
      ) : (
        <>
          {visibleProjects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              conversations={conversations.filter(
                (c) => c.projectId === project.id
              )}
              activeConversationId={activeConversationId}
              onToggle={() => onToggleProject(project.id)}
              onDelete={() => onDeleteProject(project.id)}
              onRename={(name) => onRenameProject(project.id, name)}
              onChangeIcon={() => setEditingProject(project)}
              onSelectConversation={onSelectConversation}
              onDeleteConversation={onDeleteConversation}
              onRenameConversation={onRenameConversation}
              onMoveConversation={onMoveConversation}
              allProjects={projects}
            />
          ))}

          {remaining > 0 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
            >
              <ChevronDown className="h-3 w-3" />
              Ver mais ({remaining})
            </button>
          )}

          {showAll && projects.length > MAX_VISIBLE && (
            <button
              onClick={() => setShowAll(false)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
            >
              <ChevronDown className="h-3 w-3 rotate-180" />
              Ver menos
            </button>
          )}
        </>
      )}

      {/* Create modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={onCreateProject}
      />

      {/* Edit modal */}
      <CreateProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={handleEditSubmit}
        initialName={editingProject?.name}
        initialIcon={editingProject?.icon}
        title="Editar projeto"
      />
    </div>
  )
}

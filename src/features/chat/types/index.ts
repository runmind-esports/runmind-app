export type MessageRole = 'user' | 'assistant'

export interface MessageAttachment {
  id: string
  url: string
  type: 'image'
}

export interface MessageAction {
  label: string
  type: 'upgrade'
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  createdAt: Date
  attachments?: MessageAttachment[]
  action?: MessageAction
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export interface ChatInputState {
  value: string
  isSubmitting: boolean
}

export interface SuggestionPrompt {
  id: string
  text: string
  icon?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  folderId: string | null
  projectId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
  projectId: string | null
  isExpanded: boolean
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  icon: string          // lucide-react icon name, e.g. 'folder', 'target', 'zap'
  isExpanded: boolean   // local UI state, not from API
  createdAt: Date
  updatedAt: Date
}

export interface ApiProject {
  id: string
  name: string
  icon: string
  created_at: string
  updated_at: string
}

export interface CreateProjectRequest {
  name: string
  icon: string
}

export interface UpdateProjectRequest {
  name?: string
  icon?: string
}

export interface MoveConversationRequest {
  projectId: string | null  // null to unassign
}

export interface SidebarState {
  conversations: Conversation[]
  folders: Folder[]
  projects: Project[]
  activeConversationId: string | null
  isOpen: boolean
}

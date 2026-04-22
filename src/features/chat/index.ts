// Components
export { Chat } from './components/Chat'
export { ChatHeader } from './components/ChatHeader'
export { ChatInput } from './components/ChatInput'
export { MessageBubble } from './components/MessageBubble'
export { MessageList } from './components/MessageList'
export { TypingIndicator } from './components/TypingIndicator'
export { WelcomeScreen } from './components/WelcomeScreen'
export { Sidebar } from './components/Sidebar'
export { AttachmentButton } from './components/AttachmentButton'
export { ImagePreview } from './components/ImagePreview'

// Services
export { chatApi } from './services/chatApi'

// Hooks
export { useChat } from './hooks/useChat'
export { useChatInput } from './hooks/useChatInput'
export { useChatScroll } from './hooks/useChatScroll'
export { useTypingEffect } from './hooks/useTypingEffect'
export { useSidebar } from './hooks/useSidebar'
export { useConversations } from './hooks/useConversations'
export { useImageAttachments } from './hooks/useImageAttachments'

// Utils
export { validateImageFile, validateImageFiles, isImageFile } from './utils/imageValidation'

// Types
export type {
  Message,
  MessageRole,
  MessageAttachment,
  ChatState,
  ChatInputState,
  SuggestionPrompt,
  Conversation,
  Folder,
  Project,
  SidebarState,
} from './types'

export type { ImageAttachment } from './hooks/useImageAttachments'

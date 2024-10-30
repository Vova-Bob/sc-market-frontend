export interface MessagingEvent {
  event: "create" | "edit" | "delete"
  message: {
    author: {
      username: string
      author: string
    }
    chat_id: string
    timestamp: number
    content: string
    attachments: string[]
    message_id: string
  }
  chat: {
    chat_id: string
    participants: string[]
  }
}

/**
 * Chat Message (SignalR)
 * Represents a real-time chat message received via SignalR
 * @volo/abp.ng.chat.config v2.9.0
 */
export interface ChatMessage {
  /** Sender's user ID */
  senderUserId: string;
  /** Sender's username */
  senderUsername: string;
  /** Sender's first name */
  senderName: string;
  /** Sender's surname */
  senderSurname: string;
  /** Message text content */
  text: string;
}

/**
 * Creates a new ChatMessage with optional initial values
 */
export function createChatMessage(
  initialValues?: Partial<ChatMessage>
): ChatMessage {
  return {
    senderUserId: '',
    senderUsername: '',
    senderName: '',
    senderSurname: '',
    text: '',
    ...initialValues,
  };
}

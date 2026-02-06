/**
 * Chat Contact DTO
 * Represents a chat contact with user information and last message details
 * @volo/abp.ng.chat v2.9.0
 */
export interface ChatContactDto {
  /** User ID of the contact */
  userId: string;
  /** First name of the contact */
  name: string;
  /** Last name/surname of the contact */
  surname: string;
  /** Username of the contact */
  username: string;
  /** Side of the last message (1=Sender, 2=Receiver) */
  lastMessageSide: number;
  /** Content of the last message */
  lastMessage: string;
  /** Date of the last message */
  lastMessageDate: Date | string;
  /** Count of unread messages from this contact */
  unreadMessageCount: number;
}

/**
 * Creates a new ChatContactDto with optional initial values
 */
export function createChatContactDto(
  initialValues?: Partial<ChatContactDto>
): ChatContactDto {
  return {
    userId: '',
    name: '',
    surname: '',
    username: '',
    lastMessageSide: 0,
    lastMessage: '',
    lastMessageDate: new Date(),
    unreadMessageCount: 0,
    ...initialValues,
  };
}

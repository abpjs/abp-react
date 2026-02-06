/**
 * Chat Message DTO
 * Represents a single chat message
 * @volo/abp.ng.chat v2.9.0
 */
import { ChatMessageSide } from '../enums/chat-message-side';

export interface ChatMessageDto {
  /** Content of the message */
  message: string;
  /** Date when the message was sent */
  messageDate: Date | string;
  /** Whether the message has been read */
  isRead: boolean;
  /** Date when the message was read */
  readDate: Date | string;
  /** Side of the message (Sender or Receiver) */
  side: ChatMessageSide;
}

/**
 * Creates a new ChatMessageDto with optional initial values
 */
export function createChatMessageDto(
  initialValues?: Partial<ChatMessageDto>
): ChatMessageDto {
  return {
    message: '',
    messageDate: new Date(),
    isRead: false,
    readDate: new Date(),
    side: ChatMessageSide.Sender,
    ...initialValues,
  };
}

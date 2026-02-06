/**
 * Chat Conversation DTO
 * Represents a conversation with messages and target user info
 * @volo/abp.ng.chat v2.9.0
 */
import { ChatMessageDto } from './chat-message-dto';
import { ChatTargetUserInfo } from './chat-target-user-info';

export interface ChatConversationDto {
  /** List of messages in the conversation */
  messages: ChatMessageDto[];
  /** Information about the target user */
  targetUserInfo: ChatTargetUserInfo;
}

/**
 * Creates a new ChatConversationDto with optional initial values
 */
export function createChatConversationDto(
  initialValues?: Partial<ChatConversationDto>
): ChatConversationDto {
  return {
    messages: [],
    targetUserInfo: {
      userId: '',
      name: '',
      surname: '',
      username: '',
    },
    ...initialValues,
  };
}

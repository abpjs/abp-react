/**
 * Conversation Service
 * Service for managing chat conversations via REST API
 * Translated from @volo/abp.ng.chat ConversationService v2.9.0
 */
import { RestService } from '@abpjs/core';
import type { ChatConversationDto } from '../models/chat-conversation-dto';
import type { GetConversationInput } from '../models/get-conversation-input';
import type { SendMessageInput } from '../models/send-message-input';
import type { MarkConversationAsReadInput } from '../models/mark-conversation-as-read-input';

/**
 * Service for chat conversation operations
 */
export class ConversationService {
  private rest: RestService;

  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(rest: RestService) {
    this.rest = rest;
  }

  /**
   * Send a message to a user
   * @param body Message input containing target user and message content
   * @returns Promise resolving when message is sent
   */
  sendMessageByInput(body: SendMessageInput): Promise<void> {
    return this.rest.request<SendMessageInput, void>({
      method: 'POST',
      url: '/api/chat/conversation/send-message',
      body,
    });
  }

  /**
   * Get conversation with a user
   * @param params Optional parameters including target user ID and pagination
   * @returns Promise with conversation data including messages and target user info
   */
  getConversationByInput(params?: GetConversationInput): Promise<ChatConversationDto> {
    return this.rest.request<null, ChatConversationDto>({
      method: 'GET',
      url: '/api/chat/conversation/conversation',
      params: params as unknown as Record<string, unknown>,
    });
  }

  /**
   * Mark all messages in a conversation as read
   * @param body Input containing target user ID
   * @returns Promise resolving when conversation is marked as read
   */
  markConversationAsReadByInput(body: MarkConversationAsReadInput): Promise<void> {
    return this.rest.request<MarkConversationAsReadInput, void>({
      method: 'POST',
      url: '/api/chat/conversation/mark-conversation-as-read',
      body,
    });
  }
}

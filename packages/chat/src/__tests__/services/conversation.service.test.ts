/**
 * Tests for ConversationService
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConversationService } from '../../services/conversation.service';

describe('ConversationService', () => {
  const mockRestService = {
    request: vi.fn(),
  };

  let service: ConversationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ConversationService(mockRestService as any);
  });

  it('should have default apiName', () => {
    expect(service.apiName).toBe('default');
  });

  describe('sendMessageByInput', () => {
    it('should call REST service with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.sendMessageByInput({
        targetUserId: 'user-123',
        message: 'Hello!',
      });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/chat/conversation/send-message',
        body: { targetUserId: 'user-123', message: 'Hello!' },
      });
    });
  });

  describe('getConversationByInput', () => {
    it('should call REST service with correct parameters', async () => {
      const mockConversation = {
        messages: [],
        targetUserInfo: { userId: 'user-123', name: 'John' },
      };
      mockRestService.request.mockResolvedValue(mockConversation);

      const result = await service.getConversationByInput({
        targetUserId: 'user-123',
        skipCount: 0,
        maxResultCount: 20,
      });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/chat/conversation/conversation',
        params: { targetUserId: 'user-123', skipCount: 0, maxResultCount: 20 },
      });
      expect(result).toEqual(mockConversation);
    });

    it('should call REST service without parameters', async () => {
      const mockConversation = { messages: [], targetUserInfo: {} };
      mockRestService.request.mockResolvedValue(mockConversation);

      await service.getConversationByInput();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/chat/conversation/conversation',
        params: undefined,
      });
    });
  });

  describe('markConversationAsReadByInput', () => {
    it('should call REST service with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.markConversationAsReadByInput({
        targetUserId: 'user-456',
      });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/chat/conversation/mark-conversation-as-read',
        body: { targetUserId: 'user-456' },
      });
    });
  });
});

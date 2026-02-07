/**
 * Tests for ChatConfigService
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ChatConfigService,
  getChatConfigService,
  resetChatConfigService,
} from '../../services/chat-config.service';

describe('ChatConfigService', () => {
  const mockRestService = {
    request: vi.fn(),
  };
  const mockGetAccessToken = vi.fn().mockResolvedValue('test-token');

  let service: ChatConfigService;

  beforeEach(() => {
    vi.clearAllMocks();
    resetChatConfigService();
    service = new ChatConfigService(mockRestService as any, mockGetAccessToken);
  });

  afterEach(() => {
    resetChatConfigService();
  });

  it('should have default apiName', () => {
    expect(service.apiName).toBe('default');
  });

  it('should have default connectedUserId as empty string', () => {
    expect(service.connectedUserId).toBe('');
  });

  it('should have default unreadMessagesCount as 0', () => {
    expect(service.unreadMessagesCount).toBe(0);
  });

  it('should have null connection initially', () => {
    expect(service.connection).toBeNull();
  });

  describe('getConnectionState', () => {
    it('should return null when not connected', () => {
      expect(service.getConnectionState()).toBeNull();
    });
  });

  describe('isConnected', () => {
    it('should return false when not connected', () => {
      expect(service.isConnected()).toBe(false);
    });
  });

  describe('onMessage', () => {
    it('should subscribe to messages', () => {
      const callback = vi.fn();
      const unsubscribe = service.onMessage(callback);
      expect(typeof unsubscribe).toBe('function');
    });

    it('should unsubscribe when function is called', () => {
      const callback = vi.fn();
      const unsubscribe = service.onMessage(callback);
      unsubscribe();
      // Callback should not be called after unsubscribe
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('onUnreadCountChange', () => {
    it('should subscribe to unread count changes', () => {
      const callback = vi.fn();
      const unsubscribe = service.onUnreadCountChange(callback);
      expect(typeof unsubscribe).toBe('function');
    });
  });

  describe('updateUnreadCount', () => {
    it('should update unread count', () => {
      const callback = vi.fn();
      service.onUnreadCountChange(callback);

      service.updateUnreadCount(5);

      expect(service.unreadMessagesCount).toBe(5);
      expect(callback).toHaveBeenCalledWith(5);
    });
  });

  describe('incrementUnreadCount', () => {
    it('should increment by 1 by default', () => {
      service.incrementUnreadCount();
      expect(service.unreadMessagesCount).toBe(1);
    });

    it('should increment by specified amount', () => {
      service.incrementUnreadCount(5);
      expect(service.unreadMessagesCount).toBe(5);
    });
  });

  describe('decrementUnreadCount', () => {
    it('should decrement by 1 by default', () => {
      service.updateUnreadCount(5);
      service.decrementUnreadCount();
      expect(service.unreadMessagesCount).toBe(4);
    });

    it('should decrement by specified amount', () => {
      service.updateUnreadCount(10);
      service.decrementUnreadCount(3);
      expect(service.unreadMessagesCount).toBe(7);
    });

    it('should not go below 0', () => {
      service.updateUnreadCount(2);
      service.decrementUnreadCount(5);
      expect(service.unreadMessagesCount).toBe(0);
    });
  });

  describe('setTotalUnreadMessageCount', () => {
    it('should fetch and set unread count', async () => {
      mockRestService.request.mockResolvedValue({ totalUnreadMessageCount: 10 });
      const callback = vi.fn();
      service.onUnreadCountChange(callback);

      await service.setTotalUnreadMessageCount();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/chat/contact/total-unread-message-count',
      });
      expect(service.unreadMessagesCount).toBe(10);
      expect(callback).toHaveBeenCalledWith(10);
    });

    it('should handle error gracefully', async () => {
      mockRestService.request.mockRejectedValue(new Error('Network error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await service.setTotalUnreadMessageCount();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

describe('ChatConfigService - initSignalR and stopSignalR', () => {
  const mockRestService = { request: vi.fn() };
  const mockGetAccessToken = vi.fn().mockResolvedValue('test-token');
  let service: ChatConfigService;

  beforeEach(() => {
    vi.clearAllMocks();
    resetChatConfigService();
    service = new ChatConfigService(mockRestService as any, mockGetAccessToken);
  });

  afterEach(() => {
    resetChatConfigService();
  });

  it('should initialize SignalR connection', async () => {
    await service.initSignalR('/signalr-hubs/chat');

    expect(service.connection).not.toBeNull();
    expect(service.isConnected()).toBe(true);
  });

  it('should return connection state when connected', async () => {
    await service.initSignalR('/signalr-hubs/chat');

    expect(service.getConnectionState()).toBe('Connected');
  });

  it('should not reinitialize if already initialized', async () => {
    await service.initSignalR('/signalr-hubs/chat');
    const firstConnection = service.connection;

    await service.initSignalR('/signalr-hubs/chat');

    expect(service.connection).toBe(firstConnection);
  });

  it('should stop SignalR connection', async () => {
    await service.initSignalR('/signalr-hubs/chat');
    expect(service.connection).not.toBeNull();

    await service.stopSignalR();

    expect(service.connection).toBeNull();
  });

  it('should handle stopSignalR when no connection exists', async () => {
    // Should not throw
    await service.stopSignalR();
    expect(service.connection).toBeNull();
  });

  it('should handle initSignalR failure', async () => {
    const { HubConnectionBuilder } = await import('@microsoft/signalr');
    const mockBuilder = new HubConnectionBuilder();
    const mockConn = mockBuilder.withUrl('').withAutomaticReconnect().build();
    (mockConn.start as any).mockRejectedValueOnce(new Error('Connection failed'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(service.initSignalR('/signalr-hubs/chat')).rejects.toThrow('Connection failed');

    consoleSpy.mockRestore();
  });

  it('should handle stopSignalR failure gracefully', async () => {
    await service.initSignalR('/signalr-hubs/chat');
    (service.connection!.stop as any).mockRejectedValueOnce(new Error('Stop failed'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await service.stopSignalR();

    expect(consoleSpy).toHaveBeenCalledWith('Failed to stop SignalR connection:', expect.any(Error));
    expect(service.connection).toBeNull();
    consoleSpy.mockRestore();
  });

  it('should set up message handler on ReceiveChatMessage', async () => {
    await service.initSignalR('/signalr-hubs/chat');

    expect(service.connection!.on).toHaveBeenCalledWith('ReceiveChatMessage', expect.any(Function));
  });
});

describe('ChatConfigService - subscriber error handling', () => {
  const mockRestService = { request: vi.fn() };
  const mockGetAccessToken = vi.fn().mockResolvedValue('test-token');
  let service: ChatConfigService;

  beforeEach(() => {
    vi.clearAllMocks();
    resetChatConfigService();
    service = new ChatConfigService(mockRestService as any, mockGetAccessToken);
  });

  afterEach(() => {
    resetChatConfigService();
  });

  it('should handle error in unread count subscriber', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const errorCallback = vi.fn().mockImplementation(() => {
      throw new Error('Subscriber error');
    });
    service.onUnreadCountChange(errorCallback);

    service.updateUnreadCount(5);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in unread count subscriber callback:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it('should unsubscribe from unread count changes', () => {
    const callback = vi.fn();
    const unsubscribe = service.onUnreadCountChange(callback);

    service.updateUnreadCount(5);
    expect(callback).toHaveBeenCalledWith(5);

    callback.mockClear();
    unsubscribe();

    service.updateUnreadCount(10);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle error in message subscriber', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const errorCallback = vi.fn().mockImplementation(() => {
      throw new Error('Message handler error');
    });
    service.onMessage(errorCallback);

    // Initialize to get the ReceiveChatMessage handler
    await service.initSignalR('/signalr-hubs/chat');

    // Get the registered handler and call it
    const onCall = (service.connection!.on as any).mock.calls.find(
      (call: any[]) => call[0] === 'ReceiveChatMessage'
    );
    expect(onCall).toBeDefined();
    const handler = onCall[1];

    handler({
      senderUserId: 'user-1',
      senderUsername: 'test',
      senderName: 'Test',
      senderSurname: 'User',
      text: 'Hello',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in message subscriber callback:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

describe('getChatConfigService', () => {
  const mockRestService = { request: vi.fn() };
  const mockGetAccessToken = vi.fn();

  beforeEach(() => {
    resetChatConfigService();
  });

  afterEach(() => {
    resetChatConfigService();
  });

  it('should create singleton instance', () => {
    const service1 = getChatConfigService(mockRestService as any, mockGetAccessToken);
    const service2 = getChatConfigService();

    expect(service1).toBe(service2);
  });

  it('should throw error if not initialized without parameters', () => {
    expect(() => getChatConfigService()).toThrow(
      'ChatConfigService requires RestService and getAccessToken on first initialization'
    );
  });
});

describe('resetChatConfigService', () => {
  const mockRestService = { request: vi.fn() };
  const mockGetAccessToken = vi.fn();

  it('should reset singleton instance', () => {
    getChatConfigService(mockRestService as any, mockGetAccessToken);
    resetChatConfigService();

    // Should throw because instance was reset
    expect(() => getChatConfigService()).toThrow();
  });
});

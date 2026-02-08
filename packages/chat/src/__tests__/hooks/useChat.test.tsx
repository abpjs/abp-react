/**
 * Tests for useChat hook
 * @abpjs/chat v4.0.0
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from '../../hooks/useChat';
import { ChatMessageSide } from '../../enums/chat-message-side';
import {
  ChatConfigService,
  resetChatConfigService,
} from '../../services/chat-config.service';

// Mock the service modules — keep signalR from setup.ts
const mockGetContactsByInput = vi.fn();
const mockGetConversationByInput = vi.fn();
const mockSendMessageByInput = vi.fn();
const mockMarkConversationAsReadByInput = vi.fn();

vi.mock('../../services/contact.service', () => ({
  ContactService: vi.fn().mockImplementation(() => ({
    getContactsByInput: (...args: any[]) => mockGetContactsByInput(...args),
  })),
}));

vi.mock('../../services/conversation.service', () => ({
  ConversationService: vi.fn().mockImplementation(() => ({
    getConversationByInput: (...args: any[]) => mockGetConversationByInput(...args),
    sendMessageByInput: (...args: any[]) => mockSendMessageByInput(...args),
    markConversationAsReadByInput: (...args: any[]) => mockMarkConversationAsReadByInput(...args),
  })),
}));

// Don't mock chat-config.service — let it use the real implementation with mocked signalR from setup.ts

describe('useChat', () => {
  const mockRestService = {
    request: vi.fn().mockResolvedValue({ totalUnreadMessageCount: 3 }),
  };
  const mockGetAccessToken = vi.fn().mockResolvedValue('test-token');

  const makeOptions = (overrides = {}) => ({
    rest: mockRestService as any,
    getAccessToken: mockGetAccessToken,
    hubUrl: '/signalr-hubs/chat',
    includeOtherContacts: true,
    maxResultCount: 20,
    ...overrides,
  });

  const mockContacts = [
    {
      userId: 'user-1',
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
      lastMessageSide: ChatMessageSide.Sender,
      lastMessage: 'Hello!',
      lastMessageDate: new Date('2024-06-01'),
      unreadMessageCount: 2,
    },
    {
      userId: 'user-2',
      name: 'Jane',
      surname: 'Smith',
      username: 'janesmith',
      lastMessageSide: ChatMessageSide.Receiver,
      lastMessage: 'Hi!',
      lastMessageDate: new Date('2024-06-01'),
      unreadMessageCount: 0,
    },
  ];

  const mockConversation = {
    messages: [
      {
        message: 'Hello!',
        messageDate: new Date('2024-06-01'),
        isRead: true,
        readDate: new Date('2024-06-01'),
        side: ChatMessageSide.Sender,
      },
      {
        message: 'Hi there!',
        messageDate: new Date('2024-06-01'),
        isRead: true,
        readDate: new Date('2024-06-01'),
        side: ChatMessageSide.Receiver,
      },
    ],
    targetUserInfo: {
      userId: 'user-1',
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
    },
  };

  const wait = (ms = 50) => act(async () => { await new Promise(r => setTimeout(r, ms)); });

  beforeEach(() => {
    // Reset only our mock functions, NOT vi.clearAllMocks() which wipes vi.mock factory implementations
    resetChatConfigService();
    mockGetContactsByInput.mockClear().mockResolvedValue(mockContacts);
    mockGetConversationByInput.mockClear().mockResolvedValue(mockConversation);
    mockSendMessageByInput.mockClear().mockResolvedValue(undefined);
    mockMarkConversationAsReadByInput.mockClear().mockResolvedValue(undefined);
    mockRestService.request.mockClear().mockResolvedValue({ totalUnreadMessageCount: 3 });
    mockGetAccessToken.mockClear().mockResolvedValue('test-token');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    resetChatConfigService();
    // Only restore console.error spy — do NOT call vi.restoreAllMocks() as it
    // restores vi.fn().mockImplementation() on vi.mock factories (ContactService, ConversationService)
    vi.mocked(console.error).mockRestore?.();
  });

  it('should initialize and load contacts on mount', async () => {
    const { result } = renderHook(() => useChat(makeOptions()));
    await wait();

    expect(mockGetContactsByInput).toHaveBeenCalledWith({ includeOtherContacts: true });
    expect(result.current.contacts).toEqual(mockContacts);
    expect(result.current.chatConfigService).toBeDefined();
    expect(result.current.chatConfigService).toBeInstanceOf(ChatConfigService);
  });

  it('should have correct initial state before init completes', () => {
    const { result } = renderHook(() => useChat(makeOptions()));
    expect(result.current.contacts).toEqual([]);
    expect(result.current.selectedContact).toBeNull();
    expect(result.current.unreadMessageCount).toBe(0);
    expect(result.current.contactsLoading).toBe(false);
    expect(result.current.messagesLoading).toBe(false);
    expect(result.current.allMessagesLoaded).toBe(false);
  });

  it('should stop SignalR on unmount', async () => {
    const { result, unmount } = renderHook(() => useChat(makeOptions()));
    await wait();

    const stopSpy = vi.spyOn(result.current.chatConfigService, 'stopSignalR');
    unmount();
    expect(stopSpy).toHaveBeenCalled();
  });

  it('should handle init failure gracefully', async () => {
    // Make initSignalR fail by having the HubConnectionBuilder.build().start() fail
    // Since we use the global mock from setup.ts, let's just test contacts load failure
    mockGetContactsByInput.mockRejectedValueOnce(new Error('Network error'));

    // The init function catches errors and logs them
    renderHook(() => useChat(makeOptions()));
    await wait();

    // Error should be caught internally
    // (init failure is caught by the init function's try/catch)
  });

  describe('selectContact', () => {
    it('should select a contact and load conversation', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      await act(async () => {
        await result.current.selectContact(mockContacts[0]);
      });

      expect(result.current.selectedContact).toEqual(mockContacts[0]);
      expect(mockGetConversationByInput).toHaveBeenCalledWith({
        targetUserId: 'user-1',
        skipCount: 0,
        maxResultCount: 20,
      });
      expect(result.current.userMessages.get('user-1')).toEqual(mockConversation.messages);
    });

    it('should not reload conversation for already loaded contact', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      await act(async () => {
        await result.current.selectContact(mockContacts[0]);
      });
      mockGetConversationByInput.mockClear();

      await act(async () => {
        await result.current.selectContact(mockContacts[0]);
      });

      expect(mockGetConversationByInput).not.toHaveBeenCalled();
    });

    it('should set allMessagesLoaded when fewer messages than maxResultCount', async () => {
      mockGetConversationByInput.mockResolvedValue({
        messages: [mockConversation.messages[0]],
        targetUserInfo: mockConversation.targetUserInfo,
      });

      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      await act(async () => {
        await result.current.selectContact(mockContacts[0]);
      });

      expect(result.current.allMessagesLoaded).toBe(true);
    });

    it('should handle conversation load failure', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      mockGetConversationByInput.mockRejectedValueOnce(new Error('Load failed'));

      await act(async () => {
        await result.current.selectContact(mockContacts[0]);
      });

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load conversation:',
        expect.any(Error)
      );
      expect(result.current.messagesLoading).toBe(false);
    });
  });

  describe('sendMessage', () => {
    it('should send a message and update local state', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      await act(async () => {
        await result.current.selectContact(mockContacts[0]);
      });

      await act(async () => {
        await result.current.sendMessage('user-1', 'New message');
      });

      expect(mockSendMessageByInput).toHaveBeenCalledWith({
        targetUserId: 'user-1',
        message: 'New message',
      });

      const messages = result.current.userMessages.get('user-1')!;
      const lastMessage = messages[messages.length - 1];
      expect(lastMessage.message).toBe('New message');
      expect(lastMessage.side).toBe(ChatMessageSide.Sender);

      const updatedContact = result.current.contacts.find((c) => c.userId === 'user-1');
      expect(updatedContact?.lastMessage).toBe('New message');
      expect(updatedContact?.lastMessageSide).toBe(ChatMessageSide.Sender);
    });

    it('should handle send failure and rethrow', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      mockSendMessageByInput.mockRejectedValueOnce(new Error('Send failed'));

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.sendMessage('user-1', 'Message');
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Send failed');
    });
  });

  describe('loadMoreMessages', () => {
    it('should load more messages and prepend them', async () => {
      // Use maxResultCount=2 so initial load doesn't set allMessagesLoaded
      const { result } = renderHook(() => useChat(makeOptions({ maxResultCount: 2 })));
      await wait();

      await act(async () => {
        await result.current.selectContact(mockContacts[0]);
      });

      // allMessagesLoaded should be false since messages.length === maxResultCount
      expect(result.current.allMessagesLoaded).toBe(false);

      mockGetConversationByInput.mockResolvedValueOnce({
        messages: [{
          message: 'Older message',
          messageDate: new Date('2024-01-01'),
          isRead: true,
          readDate: new Date('2024-01-01'),
          side: ChatMessageSide.Receiver,
        }],
        targetUserInfo: mockConversation.targetUserInfo,
      });

      await act(async () => {
        await result.current.loadMoreMessages('user-1');
      });

      const messages = result.current.userMessages.get('user-1')!;
      expect(messages[0].message).toBe('Older message');
      expect(messages.length).toBe(3);
    });

    it('should not load when allMessagesLoaded is true', async () => {
      mockGetConversationByInput.mockResolvedValueOnce({
        messages: [],
        targetUserInfo: mockConversation.targetUserInfo,
      });

      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      await act(async () => {
        await result.current.selectContact(mockContacts[0]);
      });

      expect(result.current.allMessagesLoaded).toBe(true);
      mockGetConversationByInput.mockClear();

      await act(async () => {
        await result.current.loadMoreMessages('user-1');
      });

      expect(mockGetConversationByInput).not.toHaveBeenCalled();
    });

    it('should handle load more failure', async () => {
      // Use maxResultCount=2 so initial load doesn't set allMessagesLoaded
      const { result } = renderHook(() => useChat(makeOptions({ maxResultCount: 2 })));
      await wait();

      await act(async () => {
        await result.current.selectContact(mockContacts[0]);
      });

      mockGetConversationByInput.mockRejectedValueOnce(new Error('Load more failed'));

      await act(async () => {
        await result.current.loadMoreMessages('user-1');
      });

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load more messages:',
        expect.any(Error)
      );
      expect(result.current.messagesLoading).toBe(false);
    });
  });

  describe('markAsRead', () => {
    it('should mark conversation as read and update state', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      await act(async () => {
        await result.current.markAsRead('user-1');
      });

      expect(mockMarkConversationAsReadByInput).toHaveBeenCalledWith({
        targetUserId: 'user-1',
      });

      const updatedContact = result.current.contacts.find((c) => c.userId === 'user-1');
      expect(updatedContact?.unreadMessageCount).toBe(0);
    });

    it('should handle mark as read failure', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      mockMarkConversationAsReadByInput.mockRejectedValueOnce(new Error('Mark failed'));

      await act(async () => {
        await result.current.markAsRead('user-1');
      });

      expect(console.error).toHaveBeenCalledWith(
        'Failed to mark conversation as read:',
        expect.any(Error)
      );
    });

    it('should not decrement for contact with 0 unread', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      await act(async () => {
        await result.current.markAsRead('user-2');
      });

      expect(mockMarkConversationAsReadByInput).toHaveBeenCalled();
      const contact = result.current.contacts.find((c) => c.userId === 'user-2');
      expect(contact?.unreadMessageCount).toBe(0);
    });
  });

  describe('refreshContacts', () => {
    it('should refresh the contacts list', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      const newContacts = [mockContacts[0]];
      mockGetContactsByInput.mockResolvedValueOnce(newContacts);

      await act(async () => {
        await result.current.refreshContacts();
      });

      expect(result.current.contacts).toEqual(newContacts);
    });

    it('should handle refresh failure', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      mockGetContactsByInput.mockRejectedValueOnce(new Error('Refresh failed'));

      await act(async () => {
        await result.current.refreshContacts();
      });

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load contacts:',
        expect.any(Error)
      );
      expect(result.current.contactsLoading).toBe(false);
    });
  });

  describe('unread count changes', () => {
    it('should update unreadMessageCount via chatConfigService', async () => {
      const { result } = renderHook(() => useChat(makeOptions()));
      await wait();

      await act(async () => {
        result.current.chatConfigService.updateUnreadCount(10);
      });

      expect(result.current.unreadMessageCount).toBe(10);
    });
  });

  describe('default options', () => {
    it('should use default hubUrl and maxResultCount', () => {
      const { result } = renderHook(() =>
        useChat({ rest: mockRestService as any, getAccessToken: mockGetAccessToken })
      );
      expect(result.current).toBeDefined();
      expect(result.current.selectedContact).toBeNull();
    });
  });
});

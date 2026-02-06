/**
 * useChat Hook
 * Hook for managing chat state and operations
 * @abpjs/chat v2.9.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { RestService } from '@abpjs/core';
import type { ChatContactDto } from '../models/chat-contact-dto';
import type { ChatMessageDto } from '../models/chat-message-dto';
import type { ChatMessage } from '../models/chat-message';
import { ContactService } from '../services/contact.service';
import { ConversationService } from '../services/conversation.service';
import {
  ChatConfigService,
  getChatConfigService,
} from '../services/chat-config.service';
import { ChatMessageSide } from '../enums/chat-message-side';
import { createChatMessageDto } from '../models/chat-message-dto';

export interface UseChatOptions {
  /** RestService instance */
  rest: RestService;
  /** Function to get access token for SignalR */
  getAccessToken: () => string | Promise<string>;
  /** SignalR hub URL */
  hubUrl?: string;
  /** Whether to include contacts without previous messages */
  includeOtherContacts?: boolean;
  /** Maximum messages to load per page */
  maxResultCount?: number;
}

export interface UseChatReturn {
  /** List of all contacts */
  contacts: ChatContactDto[];
  /** Currently selected contact */
  selectedContact: ChatContactDto | null;
  /** Messages map keyed by user ID */
  userMessages: Map<string, ChatMessageDto[]>;
  /** Total unread message count */
  unreadMessageCount: number;
  /** Whether contacts are loading */
  contactsLoading: boolean;
  /** Whether messages are loading */
  messagesLoading: boolean;
  /** Whether all messages for selected contact are loaded */
  allMessagesLoaded: boolean;
  /** Select a contact to chat with */
  selectContact: (contact: ChatContactDto) => void;
  /** Send a message to a user */
  sendMessage: (targetUserId: string, message: string) => Promise<void>;
  /** Load more messages for pagination */
  loadMoreMessages: (targetUserId: string) => Promise<void>;
  /** Mark conversation as read */
  markAsRead: (targetUserId: string) => Promise<void>;
  /** Refresh contacts list */
  refreshContacts: () => Promise<void>;
  /** ChatConfigService instance for advanced usage */
  chatConfigService: ChatConfigService;
}

/**
 * Hook for managing chat functionality
 *
 * @example
 * ```tsx
 * function ChatPage() {
 *   const { rest } = useRest();
 *   const { getAccessToken } = useAuth();
 *
 *   const {
 *     contacts,
 *     selectedContact,
 *     userMessages,
 *     selectContact,
 *     sendMessage,
 *   } = useChat({
 *     rest,
 *     getAccessToken,
 *     hubUrl: '/signalr-hubs/chat',
 *   });
 *
 *   return (
 *     <Chat
 *       contacts={contacts}
 *       userMessages={userMessages}
 *       selectedContact={selectedContact}
 *       onSelectContact={selectContact}
 *       onSendMessage={sendMessage}
 *     />
 *   );
 * }
 * ```
 */
export function useChat(options: UseChatOptions): UseChatReturn {
  const {
    rest,
    getAccessToken,
    hubUrl = '/signalr-hubs/chat',
    includeOtherContacts = true,
    maxResultCount = 20,
  } = options;

  const [contacts, setContacts] = useState<ChatContactDto[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContactDto | null>(null);
  const [userMessages, setUserMessages] = useState<Map<string, ChatMessageDto[]>>(new Map());
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(false);

  // Services
  const contactService = useRef(new ContactService(rest));
  const conversationService = useRef(new ConversationService(rest));
  const chatConfigService = useRef(getChatConfigService(rest, getAccessToken));

  // Initialize SignalR and load contacts on mount
  useEffect(() => {
    const init = async () => {
      try {
        await chatConfigService.current.initSignalR(hubUrl);
        await refreshContacts();
        await chatConfigService.current.setTotalUnreadMessageCount();
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    init();

    // Cleanup on unmount
    return () => {
      chatConfigService.current.stopSignalR();
    };
  }, [hubUrl]);

  // Listen for incoming messages
  useEffect(() => {
    const unsubscribe = chatConfigService.current.onMessage((message: ChatMessage) => {
      handleIncomingMessage(message);
    });

    return unsubscribe;
  }, [selectedContact]);

  // Listen for unread count changes
  useEffect(() => {
    const unsubscribe = chatConfigService.current.onUnreadCountChange((count) => {
      setUnreadMessageCount(count);
    });

    return unsubscribe;
  }, []);

  const handleIncomingMessage = useCallback(
    (message: ChatMessage) => {
      const newMessage = createChatMessageDto({
        message: message.text,
        messageDate: new Date(),
        isRead: selectedContact?.userId === message.senderUserId,
        readDate: new Date(),
        side: ChatMessageSide.Receiver,
      });

      setUserMessages((prev) => {
        const updated = new Map(prev);
        const existingMessages = updated.get(message.senderUserId) || [];
        updated.set(message.senderUserId, [...existingMessages, newMessage]);
        return updated;
      });

      // Update contact's last message
      setContacts((prev) =>
        prev.map((contact) =>
          contact.userId === message.senderUserId
            ? {
                ...contact,
                lastMessage: message.text,
                lastMessageDate: new Date(),
                lastMessageSide: ChatMessageSide.Receiver,
                unreadMessageCount:
                  selectedContact?.userId === message.senderUserId
                    ? 0
                    : contact.unreadMessageCount + 1,
              }
            : contact
        )
      );

      // Increment unread count if not viewing this conversation
      if (selectedContact?.userId !== message.senderUserId) {
        chatConfigService.current.incrementUnreadCount();
      }
    },
    [selectedContact]
  );

  const refreshContacts = useCallback(async () => {
    setContactsLoading(true);
    try {
      const result = await contactService.current.getContactsByInput({
        includeOtherContacts,
      });
      setContacts(result);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setContactsLoading(false);
    }
  }, [includeOtherContacts]);

  const selectContact = useCallback(
    async (contact: ChatContactDto) => {
      setSelectedContact(contact);
      setAllMessagesLoaded(false);

      // Load conversation if not already loaded
      if (!userMessages.has(contact.userId)) {
        setMessagesLoading(true);
        try {
          const result = await conversationService.current.getConversationByInput({
            targetUserId: contact.userId,
            skipCount: 0,
            maxResultCount,
          });
          setUserMessages((prev) => {
            const updated = new Map(prev);
            updated.set(contact.userId, result.messages);
            return updated;
          });
          setAllMessagesLoaded(result.messages.length < maxResultCount);
        } catch (error) {
          console.error('Failed to load conversation:', error);
        } finally {
          setMessagesLoading(false);
        }
      }
    },
    [userMessages, maxResultCount]
  );

  const sendMessage = useCallback(
    async (targetUserId: string, message: string) => {
      try {
        await conversationService.current.sendMessageByInput({
          targetUserId,
          message,
        });

        // Add message to local state
        const newMessage = createChatMessageDto({
          message,
          messageDate: new Date(),
          isRead: false,
          readDate: new Date(),
          side: ChatMessageSide.Sender,
        });

        setUserMessages((prev) => {
          const updated = new Map(prev);
          const existingMessages = updated.get(targetUserId) || [];
          updated.set(targetUserId, [...existingMessages, newMessage]);
          return updated;
        });

        // Update contact's last message
        setContacts((prev) =>
          prev.map((contact) =>
            contact.userId === targetUserId
              ? {
                  ...contact,
                  lastMessage: message,
                  lastMessageDate: new Date(),
                  lastMessageSide: ChatMessageSide.Sender,
                }
              : contact
          )
        );
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    },
    []
  );

  const loadMoreMessages = useCallback(
    async (targetUserId: string) => {
      if (messagesLoading || allMessagesLoaded) return;

      setMessagesLoading(true);
      try {
        const existingMessages = userMessages.get(targetUserId) || [];
        const result = await conversationService.current.getConversationByInput({
          targetUserId,
          skipCount: existingMessages.length,
          maxResultCount,
        });

        setUserMessages((prev) => {
          const updated = new Map(prev);
          const existing = updated.get(targetUserId) || [];
          updated.set(targetUserId, [...result.messages, ...existing]);
          return updated;
        });

        setAllMessagesLoaded(result.messages.length < maxResultCount);
      } catch (error) {
        console.error('Failed to load more messages:', error);
      } finally {
        setMessagesLoading(false);
      }
    },
    [messagesLoading, allMessagesLoaded, userMessages, maxResultCount]
  );

  const markAsRead = useCallback(
    async (targetUserId: string) => {
      try {
        await conversationService.current.markConversationAsReadByInput({
          targetUserId,
        });

        // Update local state
        const contact = contacts.find((c) => c.userId === targetUserId);
        if (contact && contact.unreadMessageCount > 0) {
          chatConfigService.current.decrementUnreadCount(contact.unreadMessageCount);

          setContacts((prev) =>
            prev.map((c) =>
              c.userId === targetUserId ? { ...c, unreadMessageCount: 0 } : c
            )
          );
        }
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    },
    [contacts]
  );

  return {
    contacts,
    selectedContact,
    userMessages,
    unreadMessageCount,
    contactsLoading,
    messagesLoading,
    allMessagesLoaded,
    selectContact,
    sendMessage,
    loadMoreMessages,
    markAsRead,
    refreshContacts,
    chatConfigService: chatConfigService.current,
  };
}

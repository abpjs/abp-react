/**
 * Tests for @abpjs/chat package exports
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect } from 'vitest';
import * as chatExports from '../index';

describe('@abpjs/chat exports', () => {
  describe('Enums', () => {
    it('should export ChatMessageSide enum', () => {
      expect(chatExports.ChatMessageSide).toBeDefined();
      expect(chatExports.ChatMessageSide.Sender).toBe(1);
      expect(chatExports.ChatMessageSide.Receiver).toBe(2);
    });

    it('should export eChatComponents', () => {
      expect(chatExports.eChatComponents).toBeDefined();
      expect(chatExports.eChatComponents.Chat).toBe('Chat.ChatComponent');
    });

    it('should export eChatRouteNames', () => {
      expect(chatExports.eChatRouteNames).toBeDefined();
      expect(chatExports.eChatRouteNames.Chat).toBe('AbpChat::Chat');
    });
  });

  describe('Models', () => {
    it('should export createChatContactDto', () => {
      expect(chatExports.createChatContactDto).toBeDefined();
      expect(typeof chatExports.createChatContactDto).toBe('function');
    });

    it('should export createChatMessageDto', () => {
      expect(chatExports.createChatMessageDto).toBeDefined();
      expect(typeof chatExports.createChatMessageDto).toBe('function');
    });

    it('should export createChatConversationDto', () => {
      expect(chatExports.createChatConversationDto).toBeDefined();
      expect(typeof chatExports.createChatConversationDto).toBe('function');
    });

    it('should export createChatTargetUserInfo', () => {
      expect(chatExports.createChatTargetUserInfo).toBeDefined();
      expect(typeof chatExports.createChatTargetUserInfo).toBe('function');
    });

    it('should export createChatMessage', () => {
      expect(chatExports.createChatMessage).toBeDefined();
      expect(typeof chatExports.createChatMessage).toBe('function');
    });

    it('should export createGetContactsInput', () => {
      expect(chatExports.createGetContactsInput).toBeDefined();
      expect(typeof chatExports.createGetContactsInput).toBe('function');
    });

    it('should export createGetConversationInput', () => {
      expect(chatExports.createGetConversationInput).toBeDefined();
      expect(typeof chatExports.createGetConversationInput).toBe('function');
    });

    it('should export createSendMessageInput', () => {
      expect(chatExports.createSendMessageInput).toBeDefined();
      expect(typeof chatExports.createSendMessageInput).toBe('function');
    });

    it('should export createMarkConversationAsReadInput', () => {
      expect(chatExports.createMarkConversationAsReadInput).toBeDefined();
      expect(typeof chatExports.createMarkConversationAsReadInput).toBe('function');
    });
  });

  describe('Services', () => {
    it('should export ContactService', () => {
      expect(chatExports.ContactService).toBeDefined();
    });

    it('should export ConversationService', () => {
      expect(chatExports.ConversationService).toBeDefined();
    });

    it('should export ChatConfigService', () => {
      expect(chatExports.ChatConfigService).toBeDefined();
    });

    it('should export getChatConfigService', () => {
      expect(chatExports.getChatConfigService).toBeDefined();
      expect(typeof chatExports.getChatConfigService).toBe('function');
    });

    it('should export resetChatConfigService', () => {
      expect(chatExports.resetChatConfigService).toBeDefined();
      expect(typeof chatExports.resetChatConfigService).toBe('function');
    });
  });

  describe('Constants', () => {
    it('should export CHAT_ROUTE_PATH', () => {
      expect(chatExports.CHAT_ROUTE_PATH).toBe('/chat');
    });

    it('should export CHAT_API_BASE', () => {
      expect(chatExports.CHAT_API_BASE).toBe('/api/chat');
    });

    it('should export CHAT_HUB_PATH', () => {
      expect(chatExports.CHAT_HUB_PATH).toBe('/signalr-hubs/chat');
    });
  });

  describe('Hooks', () => {
    it('should export useChat', () => {
      expect(chatExports.useChat).toBeDefined();
      expect(typeof chatExports.useChat).toBe('function');
    });
  });

  describe('Components', () => {
    it('should export Chat', () => {
      expect(chatExports.Chat).toBeDefined();
    });

    it('should export ChatContacts', () => {
      expect(chatExports.ChatContacts).toBeDefined();
    });

    it('should export ChatIcon', () => {
      expect(chatExports.ChatIcon).toBeDefined();
    });

    it('should export ConversationAvatar', () => {
      expect(chatExports.ConversationAvatar).toBeDefined();
    });

    it('should export getContactName helper', () => {
      expect(chatExports.getContactName).toBeDefined();
      expect(typeof chatExports.getContactName).toBe('function');
    });
  });
});

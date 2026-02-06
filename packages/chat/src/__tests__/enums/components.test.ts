/**
 * Tests for eChatComponents enum
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect } from 'vitest';
import { eChatComponents, ChatComponentKey } from '../../enums/components';

describe('eChatComponents', () => {
  it('should have Chat component key', () => {
    expect(eChatComponents.Chat).toBe('Chat.ChatComponent');
  });

  it('should have ChatContacts component key', () => {
    expect(eChatComponents.ChatContacts).toBe('Chat.ChatContactsComponent');
  });

  it('should have ConversationAvatar component key', () => {
    expect(eChatComponents.ConversationAvatar).toBe('Chat.ConversationAvatarComponent');
  });

  it('should have ChatIcon component key', () => {
    expect(eChatComponents.ChatIcon).toBe('Chat.ChatIconComponent');
  });

  it('should have exactly 4 component keys', () => {
    const keys = Object.keys(eChatComponents);
    expect(keys).toHaveLength(4);
  });

  it('should have all keys starting with Chat prefix', () => {
    const values = Object.values(eChatComponents);
    values.forEach((value) => {
      expect(value).toMatch(/^Chat\./);
    });
  });

  it('ChatComponentKey type should be valid for all component keys', () => {
    const keys: ChatComponentKey[] = [
      eChatComponents.Chat,
      eChatComponents.ChatContacts,
      eChatComponents.ConversationAvatar,
      eChatComponents.ChatIcon,
    ];
    expect(keys).toHaveLength(4);
  });
});

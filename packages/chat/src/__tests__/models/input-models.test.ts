/**
 * Tests for input models
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect } from 'vitest';
import { createGetContactsInput } from '../../models/get-contacts-input';
import { createGetConversationInput } from '../../models/get-conversation-input';
import { createSendMessageInput } from '../../models/send-message-input';
import { createMarkConversationAsReadInput } from '../../models/mark-conversation-as-read-input';

describe('GetContactsInput', () => {
  it('should create with default values', () => {
    const input = createGetContactsInput();
    expect(input.filter).toBeUndefined();
    expect(input.includeOtherContacts).toBeUndefined();
  });

  it('should create with provided values', () => {
    const input = createGetContactsInput({
      filter: 'john',
      includeOtherContacts: true,
    });
    expect(input.filter).toBe('john');
    expect(input.includeOtherContacts).toBe(true);
  });
});

describe('GetConversationInput', () => {
  it('should create with default values', () => {
    const input = createGetConversationInput();
    expect(input.targetUserId).toBe('');
    expect(input.skipCount).toBe(0);
    expect(input.maxResultCount).toBe(20);
  });

  it('should create with provided values', () => {
    const input = createGetConversationInput({
      targetUserId: 'user-456',
      skipCount: 10,
      maxResultCount: 50,
    });
    expect(input.targetUserId).toBe('user-456');
    expect(input.skipCount).toBe(10);
    expect(input.maxResultCount).toBe(50);
  });
});

describe('SendMessageInput', () => {
  it('should create with default values', () => {
    const input = createSendMessageInput();
    expect(input.targetUserId).toBe('');
    expect(input.message).toBe('');
  });

  it('should create with provided values', () => {
    const input = createSendMessageInput({
      targetUserId: 'user-789',
      message: 'Hello!',
    });
    expect(input.targetUserId).toBe('user-789');
    expect(input.message).toBe('Hello!');
  });
});

describe('MarkConversationAsReadInput', () => {
  it('should create with default values', () => {
    const input = createMarkConversationAsReadInput();
    expect(input.targetUserId).toBe('');
  });

  it('should create with provided values', () => {
    const input = createMarkConversationAsReadInput({
      targetUserId: 'user-abc',
    });
    expect(input.targetUserId).toBe('user-abc');
  });
});

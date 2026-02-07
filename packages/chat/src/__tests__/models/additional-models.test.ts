/**
 * Tests for additional model factory functions
 * @abpjs/chat v4.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  createChatConversationDto,
  type ChatConversationDto,
} from '../../models/chat-conversation-dto';
import { createChatMessage, type ChatMessage } from '../../models/chat-message';
import {
  createChatTargetUserInfo,
  type ChatTargetUserInfo,
} from '../../models/chat-target-user-info';

describe('ChatConversationDto', () => {
  it('should create with default values', () => {
    const dto = createChatConversationDto();
    expect(dto.messages).toEqual([]);
    expect(dto.targetUserInfo).toEqual({
      userId: '',
      name: '',
      surname: '',
      username: '',
    });
  });

  it('should create with provided messages', () => {
    const dto = createChatConversationDto({
      messages: [
        {
          message: 'Hello',
          messageDate: new Date('2024-01-01'),
          isRead: true,
          readDate: new Date('2024-01-01'),
          side: 1,
        },
      ],
    });
    expect(dto.messages).toHaveLength(1);
    expect(dto.messages[0].message).toBe('Hello');
  });

  it('should create with provided targetUserInfo', () => {
    const dto = createChatConversationDto({
      targetUserInfo: {
        userId: 'user-123',
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
      },
    });
    expect(dto.targetUserInfo.userId).toBe('user-123');
    expect(dto.targetUserInfo.name).toBe('John');
  });

  it('should create with all values overridden', () => {
    const conversation: ChatConversationDto = createChatConversationDto({
      messages: [
        {
          message: 'Test',
          messageDate: new Date(),
          isRead: false,
          readDate: new Date(),
          side: 2,
        },
      ],
      targetUserInfo: {
        userId: 'u1',
        name: 'A',
        surname: 'B',
        username: 'ab',
      },
    });
    expect(conversation.messages).toHaveLength(1);
    expect(conversation.targetUserInfo.username).toBe('ab');
  });
});

describe('ChatMessage', () => {
  it('should create with default values', () => {
    const msg = createChatMessage();
    expect(msg.senderUserId).toBe('');
    expect(msg.senderUsername).toBe('');
    expect(msg.senderName).toBe('');
    expect(msg.senderSurname).toBe('');
    expect(msg.text).toBe('');
  });

  it('should create with provided values', () => {
    const msg = createChatMessage({
      senderUserId: 'user-1',
      senderUsername: 'johndoe',
      senderName: 'John',
      senderSurname: 'Doe',
      text: 'Hello world!',
    });
    expect(msg.senderUserId).toBe('user-1');
    expect(msg.senderUsername).toBe('johndoe');
    expect(msg.senderName).toBe('John');
    expect(msg.senderSurname).toBe('Doe');
    expect(msg.text).toBe('Hello world!');
  });

  it('should create with partial values', () => {
    const msg = createChatMessage({
      senderUserId: 'user-abc',
      text: 'Partial',
    });
    expect(msg.senderUserId).toBe('user-abc');
    expect(msg.text).toBe('Partial');
    expect(msg.senderUsername).toBe('');
    expect(msg.senderName).toBe('');
  });

  it('should satisfy ChatMessage interface', () => {
    const msg: ChatMessage = createChatMessage({ text: 'typed' });
    expect(msg.text).toBe('typed');
  });
});

describe('ChatTargetUserInfo', () => {
  it('should create with default values', () => {
    const info = createChatTargetUserInfo();
    expect(info.userId).toBe('');
    expect(info.name).toBe('');
    expect(info.surname).toBe('');
    expect(info.username).toBe('');
  });

  it('should create with provided values', () => {
    const info = createChatTargetUserInfo({
      userId: 'user-456',
      name: 'Jane',
      surname: 'Smith',
      username: 'janesmith',
    });
    expect(info.userId).toBe('user-456');
    expect(info.name).toBe('Jane');
    expect(info.surname).toBe('Smith');
    expect(info.username).toBe('janesmith');
  });

  it('should create with partial values', () => {
    const info = createChatTargetUserInfo({
      userId: 'u1',
      name: 'Alice',
    });
    expect(info.userId).toBe('u1');
    expect(info.name).toBe('Alice');
    expect(info.surname).toBe('');
    expect(info.username).toBe('');
  });

  it('should satisfy ChatTargetUserInfo interface', () => {
    const info: ChatTargetUserInfo = createChatTargetUserInfo({ username: 'test' });
    expect(info.username).toBe('test');
  });
});

/**
 * Tests for ChatMessageDto model
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect } from 'vitest';
import { createChatMessageDto } from '../../models/chat-message-dto';
import { ChatMessageSide } from '../../enums/chat-message-side';

describe('ChatMessageDto', () => {
  it('should create with default values', () => {
    const dto = createChatMessageDto();
    expect(dto.message).toBe('');
    expect(dto.messageDate).toBeInstanceOf(Date);
    expect(dto.isRead).toBe(false);
    expect(dto.readDate).toBeInstanceOf(Date);
    expect(dto.side).toBe(ChatMessageSide.Sender);
  });

  it('should create with partial values', () => {
    const dto = createChatMessageDto({
      message: 'Hello, world!',
      isRead: true,
    });
    expect(dto.message).toBe('Hello, world!');
    expect(dto.isRead).toBe(true);
    expect(dto.side).toBe(ChatMessageSide.Sender);
  });

  it('should create with Receiver side', () => {
    const dto = createChatMessageDto({
      message: 'Hi there!',
      side: ChatMessageSide.Receiver,
    });
    expect(dto.message).toBe('Hi there!');
    expect(dto.side).toBe(ChatMessageSide.Receiver);
  });

  it('should accept string dates', () => {
    const dto = createChatMessageDto({
      messageDate: '2024-01-15T10:30:00Z',
      readDate: '2024-01-15T10:35:00Z',
    });
    expect(dto.messageDate).toBe('2024-01-15T10:30:00Z');
    expect(dto.readDate).toBe('2024-01-15T10:35:00Z');
  });
});

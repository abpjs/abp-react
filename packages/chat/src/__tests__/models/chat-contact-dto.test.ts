/**
 * Tests for ChatContactDto model
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect } from 'vitest';
import { createChatContactDto } from '../../models/chat-contact-dto';

describe('ChatContactDto', () => {
  it('should create with default values', () => {
    const dto = createChatContactDto();
    expect(dto.userId).toBe('');
    expect(dto.name).toBe('');
    expect(dto.surname).toBe('');
    expect(dto.username).toBe('');
    expect(dto.lastMessageSide).toBe(0);
    expect(dto.lastMessage).toBe('');
    expect(dto.lastMessageDate).toBeInstanceOf(Date);
    expect(dto.unreadMessageCount).toBe(0);
  });

  it('should create with partial values', () => {
    const dto = createChatContactDto({
      userId: 'user-123',
      name: 'John',
      surname: 'Doe',
    });
    expect(dto.userId).toBe('user-123');
    expect(dto.name).toBe('John');
    expect(dto.surname).toBe('Doe');
    expect(dto.username).toBe('');
  });

  it('should create with all values', () => {
    const date = new Date('2024-01-15');
    const dto = createChatContactDto({
      userId: 'user-123',
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
      lastMessageSide: 1,
      lastMessage: 'Hello!',
      lastMessageDate: date,
      unreadMessageCount: 5,
    });
    expect(dto.userId).toBe('user-123');
    expect(dto.name).toBe('John');
    expect(dto.surname).toBe('Doe');
    expect(dto.username).toBe('johndoe');
    expect(dto.lastMessageSide).toBe(1);
    expect(dto.lastMessage).toBe('Hello!');
    expect(dto.lastMessageDate).toBe(date);
    expect(dto.unreadMessageCount).toBe(5);
  });

  it('should override default values with provided values', () => {
    const dto = createChatContactDto({
      unreadMessageCount: 10,
    });
    expect(dto.unreadMessageCount).toBe(10);
    expect(dto.userId).toBe('');
  });
});

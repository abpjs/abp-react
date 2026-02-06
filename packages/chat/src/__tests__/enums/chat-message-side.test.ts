/**
 * Tests for ChatMessageSide enum
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect } from 'vitest';
import { ChatMessageSide } from '../../enums/chat-message-side';

describe('ChatMessageSide enum', () => {
  it('should have Sender value of 1', () => {
    expect(ChatMessageSide.Sender).toBe(1);
  });

  it('should have Receiver value of 2', () => {
    expect(ChatMessageSide.Receiver).toBe(2);
  });

  it('should have exactly 2 members', () => {
    const values = Object.values(ChatMessageSide).filter(
      (v) => typeof v === 'number'
    );
    expect(values).toHaveLength(2);
  });

  it('should allow reverse lookup by value', () => {
    expect(ChatMessageSide[1]).toBe('Sender');
    expect(ChatMessageSide[2]).toBe('Receiver');
  });
});

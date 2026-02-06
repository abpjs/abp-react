/**
 * Tests for eChatRouteNames enum
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect } from 'vitest';
import { eChatRouteNames, ChatRouteNameKey } from '../../enums/route-names';

describe('eChatRouteNames', () => {
  it('should have Chat route name key', () => {
    expect(eChatRouteNames.Chat).toBe('AbpChat::Chat');
  });

  it('should have exactly 1 route name key', () => {
    const keys = Object.keys(eChatRouteNames);
    expect(keys).toHaveLength(1);
  });

  it('should have all keys starting with AbpChat prefix', () => {
    const values = Object.values(eChatRouteNames);
    values.forEach((value) => {
      expect(value).toMatch(/^AbpChat::/);
    });
  });

  it('ChatRouteNameKey type should be valid for all route name keys', () => {
    const keys: ChatRouteNameKey[] = [eChatRouteNames.Chat];
    expect(keys).toHaveLength(1);
  });
});

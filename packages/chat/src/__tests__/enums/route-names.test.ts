/**
 * Tests for eChatRouteNames enum
 * @abpjs/chat v3.0.0
 *
 * Note: In v3.0.0, the route name value changed from 'AbpChat::Chat' to 'Chat'
 */
import { describe, it, expect } from 'vitest';
import { eChatRouteNames, ChatRouteNameKey } from '../../enums/route-names';

describe('eChatRouteNames', () => {
  it('should have Chat route name key', () => {
    // v3.0.0: Changed from 'AbpChat::Chat' to 'Chat'
    expect(eChatRouteNames.Chat).toBe('Chat');
  });

  it('should have exactly 1 route name key', () => {
    const keys = Object.keys(eChatRouteNames);
    expect(keys).toHaveLength(1);
  });

  it('should have expected route name values', () => {
    // v3.0.0: Route names no longer use AbpChat:: prefix
    expect(eChatRouteNames.Chat).toBe('Chat');
  });

  it('ChatRouteNameKey type should be valid for all route name keys', () => {
    const keys: ChatRouteNameKey[] = [eChatRouteNames.Chat];
    expect(keys).toHaveLength(1);
  });
});

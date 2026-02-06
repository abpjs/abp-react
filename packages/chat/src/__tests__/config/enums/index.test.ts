/**
 * Tests for config/enums index exports
 * @abpjs/chat v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as configEnums from '../../../config/enums';

describe('config/enums exports (v3.0.0)', () => {
  it('should export eChatPolicyNames', () => {
    expect(configEnums.eChatPolicyNames).toBeDefined();
    expect(configEnums.eChatPolicyNames.Messaging).toBe('Chat.Messaging');
  });

  it('should export eChatRouteNames', () => {
    expect(configEnums.eChatRouteNames).toBeDefined();
    expect(configEnums.eChatRouteNames.Chat).toBe('Chat');
  });

  it('should export all expected keys', () => {
    const exportKeys = Object.keys(configEnums);
    expect(exportKeys).toContain('eChatPolicyNames');
    expect(exportKeys).toContain('eChatRouteNames');
  });
});

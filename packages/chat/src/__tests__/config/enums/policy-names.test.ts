/**
 * Tests for eChatPolicyNames enum
 * @abpjs/chat v3.0.0
 */
import { describe, it, expect } from 'vitest';
import { eChatPolicyNames, type ChatPolicyNameKey } from '../../../config/enums/policy-names';

describe('eChatPolicyNames (v3.0.0)', () => {
  describe('enum values', () => {
    it('should have Messaging policy name', () => {
      expect(eChatPolicyNames.Messaging).toBe('Chat.Messaging');
    });

    it('should have exactly 1 policy name', () => {
      const keys = Object.keys(eChatPolicyNames);
      expect(keys).toHaveLength(1);
      expect(keys).toContain('Messaging');
    });

    it('should use Chat namespace prefix', () => {
      const values = Object.values(eChatPolicyNames);
      values.forEach((value) => {
        expect(value).toMatch(/^Chat\./);
      });
    });
  });

  describe('type safety', () => {
    it('ChatPolicyNameKey type should be valid for all policy names', () => {
      const keys: ChatPolicyNameKey[] = [eChatPolicyNames.Messaging];
      expect(keys).toHaveLength(1);
      expect(keys[0]).toBe('Chat.Messaging');
    });

    it('should be usable as string values', () => {
      const policy: string = eChatPolicyNames.Messaging;
      expect(typeof policy).toBe('string');
    });
  });

  describe('use cases', () => {
    it('should work for permission checks', () => {
      const grantedPolicies: Record<string, boolean> = {
        'Chat.Messaging': true,
      };
      expect(grantedPolicies[eChatPolicyNames.Messaging]).toBe(true);
    });

    it('should work for route configuration', () => {
      const route = {
        path: '/chat',
        requiredPolicy: eChatPolicyNames.Messaging,
      };
      expect(route.requiredPolicy).toBe('Chat.Messaging');
    });
  });
});

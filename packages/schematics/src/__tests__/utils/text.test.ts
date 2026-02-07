/**
 * Text Case Conversion Utilities Tests
 */

import { describe, expect, it } from 'vitest';
import { camel, pascal, kebab, snake, macro, dir, lower, upper } from '../../utils/text';

describe('Text Utils', () => {
  describe('lower', () => {
    it('should convert to lowercase', () => {
      expect(lower('HELLO')).toBe('hello');
    });

    it('should handle mixed case', () => {
      expect(lower('HeLLo WoRLd')).toBe('hello world');
    });
  });

  describe('upper', () => {
    it('should convert to uppercase', () => {
      expect(upper('hello')).toBe('HELLO');
    });
  });

  describe('camel', () => {
    it('should convert kebab-case', () => {
      expect(camel('user-name')).toBe('userName');
    });

    it('should convert PascalCase', () => {
      expect(camel('UserName')).toBe('userName');
    });

    it('should convert snake_case', () => {
      expect(camel('user_name')).toBe('userName');
    });

    it('should convert dot-separated namespace', () => {
      expect(camel('Volo.Abp.Users')).toBe('voloAbpUsers');
    });

    it('should handle single word', () => {
      expect(camel('user')).toBe('user');
    });

    it('should handle multiple words', () => {
      expect(camel('get user list')).toBe('getUserList');
    });
  });

  describe('pascal', () => {
    it('should convert kebab-case', () => {
      expect(pascal('user-name')).toBe('UserName');
    });

    it('should convert camelCase', () => {
      expect(pascal('userName')).toBe('UserName');
    });

    it('should convert snake_case', () => {
      expect(pascal('user_name')).toBe('UserName');
    });

    it('should handle single word', () => {
      expect(pascal('user')).toBe('User');
    });
  });

  describe('kebab', () => {
    it('should convert PascalCase', () => {
      expect(kebab('UserName')).toBe('user-name');
    });

    it('should convert camelCase', () => {
      expect(kebab('userName')).toBe('user-name');
    });

    it('should convert snake_case', () => {
      expect(kebab('user_name')).toBe('user-name');
    });

    it('should handle single word', () => {
      expect(kebab('user')).toBe('user');
    });

    it('should handle dot-separated', () => {
      expect(kebab('Volo.Abp')).toBe('volo-abp');
    });
  });

  describe('snake', () => {
    it('should convert PascalCase', () => {
      expect(snake('UserName')).toBe('user_name');
    });

    it('should convert camelCase', () => {
      expect(snake('userName')).toBe('user_name');
    });

    it('should convert kebab-case', () => {
      expect(snake('user-name')).toBe('user_name');
    });
  });

  describe('macro', () => {
    it('should convert to MACRO_CASE', () => {
      expect(macro('UserName')).toBe('USER_NAME');
    });

    it('should handle camelCase input', () => {
      expect(macro('userName')).toBe('USER_NAME');
    });
  });

  describe('dir', () => {
    it('should convert namespace to directory path', () => {
      expect(dir('Services.Models')).toBe('services/models');
    });

    it('should convert with multiple segments', () => {
      expect(dir('Volo.Abp.Users')).toBe('volo/abp/users');
    });

    it('should handle PascalCase segments', () => {
      expect(dir('IdentityServer.Clients')).toBe('identity-server/clients');
    });

    it('should handle single segment', () => {
      expect(dir('Users')).toBe('users');
    });

    it('should handle empty string', () => {
      expect(dir('')).toBe('');
    });
  });
});

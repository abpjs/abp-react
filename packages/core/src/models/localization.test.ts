import { describe, it, expect } from 'vitest';
import type { LocalizationWithDefault, LocalizationParam } from './localization';

describe('Localization model (v4.0.0)', () => {
  describe('LocalizationWithDefault', () => {
    it('should store key and default value', () => {
      const loc: LocalizationWithDefault = {
        key: 'AbpIdentity::Users',
        defaultValue: 'Users',
      };
      expect(loc.key).toBe('AbpIdentity::Users');
      expect(loc.defaultValue).toBe('Users');
    });

    it('should store empty strings', () => {
      const loc: LocalizationWithDefault = {
        key: '',
        defaultValue: '',
      };
      expect(loc.key).toBe('');
      expect(loc.defaultValue).toBe('');
    });
  });

  describe('LocalizationParam', () => {
    it('should accept a plain string', () => {
      const param: LocalizationParam = 'AbpIdentity::Users';
      expect(typeof param).toBe('string');
      expect(param).toBe('AbpIdentity::Users');
    });

    it('should accept a LocalizationWithDefault object', () => {
      const param: LocalizationParam = {
        key: 'AbpIdentity::Users',
        defaultValue: 'Users',
      };
      expect(typeof param).toBe('object');
      expect((param as LocalizationWithDefault).key).toBe('AbpIdentity::Users');
    });

    it('should be usable as string in conditional checks', () => {
      const param: LocalizationParam = 'TestKey';
      if (typeof param === 'string') {
        expect(param).toBe('TestKey');
      }
    });

    it('should be usable as object in conditional checks', () => {
      const param: LocalizationParam = { key: 'Key', defaultValue: 'Default' };
      if (typeof param === 'object') {
        expect(param.key).toBe('Key');
        expect(param.defaultValue).toBe('Default');
      }
    });
  });
});

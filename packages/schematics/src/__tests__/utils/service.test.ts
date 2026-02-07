/**
 * Service Generation Utilities Tests
 */

import { describe, expect, it } from 'vitest';
import { serializeParameters } from '../../utils/service';
import { Property } from '../../models/model';

describe('Service Utils', () => {
  describe('serializeParameters', () => {
    it('should serialize single parameter', () => {
      const params = [new Property({ name: 'id', type: 'string' })];
      expect(serializeParameters(params)).toBe('id: string');
    });

    it('should serialize multiple parameters', () => {
      const params = [
        new Property({ name: 'id', type: 'string' }),
        new Property({ name: 'input', type: 'CreateUserInput' }),
      ];
      expect(serializeParameters(params)).toBe('id: string, input: CreateUserInput');
    });

    it('should handle optional parameters', () => {
      const params = [new Property({ name: 'filter', type: 'string', optional: '?' })];
      expect(serializeParameters(params)).toBe('filter?: string');
    });

    it('should handle parameters with defaults', () => {
      const param = new Property({ name: 'page', type: 'number' });
      param.default = ' = 1';
      expect(serializeParameters([param])).toBe('page: number = 1');
    });

    it('should return empty string for no parameters', () => {
      expect(serializeParameters([])).toBe('');
    });

    it('should handle mixed optional and required', () => {
      const params = [
        new Property({ name: 'id', type: 'string' }),
        new Property({ name: 'filter', type: 'string', optional: '?' }),
      ];
      expect(serializeParameters(params)).toBe('id: string, filter?: string');
    });
  });
});

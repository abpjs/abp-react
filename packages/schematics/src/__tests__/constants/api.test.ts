/**
 * API Constants Tests
 */

import { describe, expect, it } from 'vitest';
import { API_DEFINITION_ENDPOINT } from '../../constants/api';

describe('API Constants', () => {
  describe('API_DEFINITION_ENDPOINT', () => {
    it('should be the correct endpoint path', () => {
      expect(API_DEFINITION_ENDPOINT).toBe('/api/abp/api-definition');
    });
  });
});

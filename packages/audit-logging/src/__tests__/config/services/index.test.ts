/**
 * Tests for config/services/index exports
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as ConfigServices from '../../../config/services';

describe('config/services exports (v3.0.0)', () => {
  it('should export EntityChangeModalService', () => {
    expect(ConfigServices.EntityChangeModalService).toBeDefined();
  });

  it('should export EntityChangeModalService as a class', () => {
    expect(typeof ConfigServices.EntityChangeModalService).toBe('function');
  });
});

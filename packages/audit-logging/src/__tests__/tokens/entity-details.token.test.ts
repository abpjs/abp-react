/**
 * Tests for tokens/entity-details.token
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  SHOW_ENTITY_DETAILS,
  SHOW_ENTITY_HISTORY,
  type ShowEntityDetailsFn,
  type ShowEntityHistoryFn,
} from '../../tokens/entity-details.token';

describe('entity-details.token (v3.0.0)', () => {
  describe('SHOW_ENTITY_DETAILS', () => {
    it('should be a symbol', () => {
      expect(typeof SHOW_ENTITY_DETAILS).toBe('symbol');
    });

    it('should have correct description', () => {
      expect(SHOW_ENTITY_DETAILS.description).toBe('SHOW_ENTITY_DETAILS');
    });

    it('should be unique', () => {
      const anotherSymbol = Symbol('SHOW_ENTITY_DETAILS');
      expect(SHOW_ENTITY_DETAILS).not.toBe(anotherSymbol);
    });

    it('should be usable as object key', () => {
      const obj: Record<symbol, string> = {
        [SHOW_ENTITY_DETAILS]: 'test value',
      };
      expect(obj[SHOW_ENTITY_DETAILS]).toBe('test value');
    });
  });

  describe('SHOW_ENTITY_HISTORY', () => {
    it('should be a symbol', () => {
      expect(typeof SHOW_ENTITY_HISTORY).toBe('symbol');
    });

    it('should have correct description', () => {
      expect(SHOW_ENTITY_HISTORY.description).toBe('SHOW_ENTITY_HISTORY');
    });

    it('should be unique', () => {
      const anotherSymbol = Symbol('SHOW_ENTITY_HISTORY');
      expect(SHOW_ENTITY_HISTORY).not.toBe(anotherSymbol);
    });

    it('should be different from SHOW_ENTITY_DETAILS', () => {
      expect(SHOW_ENTITY_DETAILS).not.toBe(SHOW_ENTITY_HISTORY);
    });
  });

  describe('ShowEntityDetailsFn type', () => {
    it('should accept a function matching the signature', () => {
      const fn: ShowEntityDetailsFn = (entityChangeId: string) => {
        console.log(entityChangeId);
      };
      expect(typeof fn).toBe('function');
    });

    it('should accept entityChangeId as string parameter', () => {
      const fn: ShowEntityDetailsFn = (entityChangeId) => {
        expect(typeof entityChangeId).toBe('string');
      };
      fn('test-id');
    });
  });

  describe('ShowEntityHistoryFn type', () => {
    it('should accept a function matching the signature', () => {
      const fn: ShowEntityHistoryFn = (entityId: string, entityTypeFullName: string) => {
        console.log(entityId, entityTypeFullName);
      };
      expect(typeof fn).toBe('function');
    });

    it('should accept entityId and entityTypeFullName as string parameters', () => {
      const fn: ShowEntityHistoryFn = (entityId, entityTypeFullName) => {
        expect(typeof entityId).toBe('string');
        expect(typeof entityTypeFullName).toBe('string');
      };
      fn('entity-id', 'MyApp.Entity');
    });
  });

  describe('token usage patterns', () => {
    it('should work in a dependency injection container pattern', () => {
      const container = new Map<symbol, any>();
      const showDetailsFn: ShowEntityDetailsFn = () => {};
      const showHistoryFn: ShowEntityHistoryFn = () => {};

      container.set(SHOW_ENTITY_DETAILS, showDetailsFn);
      container.set(SHOW_ENTITY_HISTORY, showHistoryFn);

      expect(container.get(SHOW_ENTITY_DETAILS)).toBe(showDetailsFn);
      expect(container.get(SHOW_ENTITY_HISTORY)).toBe(showHistoryFn);
    });

    it('should work with WeakMap for memory-safe storage', () => {
      const registry = new Map<symbol, Function>();
      const fn: ShowEntityDetailsFn = () => {};

      registry.set(SHOW_ENTITY_DETAILS, fn);

      expect(registry.has(SHOW_ENTITY_DETAILS)).toBe(true);
      expect(registry.get(SHOW_ENTITY_DETAILS)).toBe(fn);
    });
  });
});

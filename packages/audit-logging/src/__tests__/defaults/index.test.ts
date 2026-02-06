/**
 * Tests for defaults module
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  DEFAULT_AUDIT_LOGS_ENTITY_ACTIONS,
  DEFAULT_AUDIT_LOGS_ENTITY_PROPS,
  DEFAULT_AUDIT_LOGS_TOOLBAR_ACTIONS,
  DEFAULT_ENTITY_CHANGES_ENTITY_ACTIONS,
} from '../../defaults';

describe('defaults (v3.0.0)', () => {
  describe('DEFAULT_AUDIT_LOGS_ENTITY_ACTIONS', () => {
    it('should be an array', () => {
      expect(Array.isArray(DEFAULT_AUDIT_LOGS_ENTITY_ACTIONS)).toBe(true);
    });

    it('should be exported', () => {
      expect(DEFAULT_AUDIT_LOGS_ENTITY_ACTIONS).toBeDefined();
    });
  });

  describe('DEFAULT_AUDIT_LOGS_ENTITY_PROPS', () => {
    it('should be an array', () => {
      expect(Array.isArray(DEFAULT_AUDIT_LOGS_ENTITY_PROPS)).toBe(true);
    });

    it('should be exported', () => {
      expect(DEFAULT_AUDIT_LOGS_ENTITY_PROPS).toBeDefined();
    });

    it('should contain entity property definitions', () => {
      // The props have been pre-defined
      expect(DEFAULT_AUDIT_LOGS_ENTITY_PROPS.length).toBeGreaterThan(0);
    });

    it('should have valid prop structure for each item', () => {
      DEFAULT_AUDIT_LOGS_ENTITY_PROPS.forEach((prop) => {
        expect(prop).toHaveProperty('type');
        expect(prop).toHaveProperty('name');
        expect(prop).toHaveProperty('displayName');
      });
    });

    it('should have url property', () => {
      const urlProp = DEFAULT_AUDIT_LOGS_ENTITY_PROPS.find((p) => p.name === 'url');
      expect(urlProp).toBeDefined();
      expect(urlProp?.type).toBe('string');
    });

    it('should have httpMethod property', () => {
      const prop = DEFAULT_AUDIT_LOGS_ENTITY_PROPS.find((p) => p.name === 'httpMethod');
      expect(prop).toBeDefined();
    });

    it('should have httpStatusCode property', () => {
      const prop = DEFAULT_AUDIT_LOGS_ENTITY_PROPS.find((p) => p.name === 'httpStatusCode');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('number');
    });

    it('should have userName property', () => {
      const prop = DEFAULT_AUDIT_LOGS_ENTITY_PROPS.find((p) => p.name === 'userName');
      expect(prop).toBeDefined();
    });

    it('should have executionTime property', () => {
      const prop = DEFAULT_AUDIT_LOGS_ENTITY_PROPS.find((p) => p.name === 'executionTime');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('date');
    });

    it('should have executionDuration property', () => {
      const prop = DEFAULT_AUDIT_LOGS_ENTITY_PROPS.find((p) => p.name === 'executionDuration');
      expect(prop).toBeDefined();
      expect(prop?.type).toBe('number');
    });

    it('should have sortable properties', () => {
      const sortableProps = DEFAULT_AUDIT_LOGS_ENTITY_PROPS.filter((p) => p.sortable);
      expect(sortableProps.length).toBeGreaterThan(0);
    });
  });

  describe('DEFAULT_AUDIT_LOGS_TOOLBAR_ACTIONS', () => {
    it('should be an array', () => {
      expect(Array.isArray(DEFAULT_AUDIT_LOGS_TOOLBAR_ACTIONS)).toBe(true);
    });

    it('should be exported', () => {
      expect(DEFAULT_AUDIT_LOGS_TOOLBAR_ACTIONS).toBeDefined();
    });
  });

  describe('DEFAULT_ENTITY_CHANGES_ENTITY_ACTIONS', () => {
    it('should be an array', () => {
      expect(Array.isArray(DEFAULT_ENTITY_CHANGES_ENTITY_ACTIONS)).toBe(true);
    });

    it('should be exported', () => {
      expect(DEFAULT_ENTITY_CHANGES_ENTITY_ACTIONS).toBeDefined();
    });
  });

  describe('defaults structure', () => {
    it('should export all required defaults', () => {
      expect(DEFAULT_AUDIT_LOGS_ENTITY_ACTIONS).toBeDefined();
      expect(DEFAULT_AUDIT_LOGS_ENTITY_PROPS).toBeDefined();
      expect(DEFAULT_AUDIT_LOGS_TOOLBAR_ACTIONS).toBeDefined();
      expect(DEFAULT_ENTITY_CHANGES_ENTITY_ACTIONS).toBeDefined();
    });
  });
});

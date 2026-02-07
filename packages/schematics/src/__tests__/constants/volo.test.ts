/**
 * VOLO Constants Tests
 */

import { describe, expect, it } from 'vitest';
import { VOLO_NAME_VALUE, VOLO_REGEX } from '../../constants/volo';

describe('VOLO Constants', () => {
  describe('VOLO_REGEX', () => {
    it('should match Volo.Abp.Application.Dtos types', () => {
      expect(VOLO_REGEX.test('Volo.Abp.Application.Dtos.PagedResultDto')).toBe(true);
      expect(VOLO_REGEX.test('Volo.Abp.Application.Dtos.ListResultDto')).toBe(true);
    });

    it('should match Volo.Abp.ObjectExtending types', () => {
      expect(VOLO_REGEX.test('Volo.Abp.ObjectExtending.ExtensibleObject')).toBe(true);
    });

    it('should not match other Volo.Abp types', () => {
      expect(VOLO_REGEX.test('Volo.Abp.Identity.IdentityUser')).toBe(false);
      expect(VOLO_REGEX.test('Volo.Abp.NameValue')).toBe(false);
    });

    it('should not match non-Volo types', () => {
      expect(VOLO_REGEX.test('System.String')).toBe(false);
      expect(VOLO_REGEX.test('MyApp.Models.User')).toBe(false);
    });
  });

  describe('VOLO_NAME_VALUE', () => {
    it('should be an Interface instance', () => {
      expect(VOLO_NAME_VALUE).toBeDefined();
      expect(VOLO_NAME_VALUE.identifier).toBe('NameValue<T = string>');
    });

    it('should have correct ref', () => {
      expect(VOLO_NAME_VALUE.ref).toBe('Volo.Abp.NameValue');
    });

    it('should have correct namespace', () => {
      expect(VOLO_NAME_VALUE.namespace).toBe('Volo.Abp');
    });

    it('should have null base', () => {
      expect(VOLO_NAME_VALUE.base).toBeNull();
    });

    it('should have two properties', () => {
      expect(VOLO_NAME_VALUE.properties).toHaveLength(2);
    });

    it('should have name property', () => {
      const nameProperty = VOLO_NAME_VALUE.properties.find((p) => p.name === 'name');
      expect(nameProperty).toBeDefined();
      expect(nameProperty?.type).toBe('string');
      expect(nameProperty?.refs).toEqual(['System.String']);
    });

    it('should have value property', () => {
      const valueProperty = VOLO_NAME_VALUE.properties.find((p) => p.name === 'value');
      expect(valueProperty).toBeDefined();
      expect(valueProperty?.type).toBe('T');
      expect(valueProperty?.refs).toEqual(['T']);
    });
  });
});

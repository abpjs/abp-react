/**
 * Index Export Tests
 */

import { describe, expect, it } from 'vitest';
import * as schematics from './index';

describe('@abpjs/schematics exports', () => {
  describe('Enums', () => {
    it('should export eBindingSourceId', () => {
      expect(schematics.eBindingSourceId).toBeDefined();
      expect(schematics.eBindingSourceId.Body).toBe('Body');
    });

    it('should export Exception', () => {
      expect(schematics.Exception).toBeDefined();
      expect(schematics.Exception.FileNotFound).toBeDefined();
    });

    it('should export eImportKeyword', () => {
      expect(schematics.eImportKeyword).toBeDefined();
      expect(schematics.eImportKeyword.Default).toBe('import');
    });

    it('should export eMethodModifier', () => {
      expect(schematics.eMethodModifier).toBeDefined();
      expect(schematics.eMethodModifier.Public).toBe('');
    });
  });

  describe('Constants', () => {
    it('should export API_DEFINITION_ENDPOINT', () => {
      expect(schematics.API_DEFINITION_ENDPOINT).toBe('/api/abp/api-definition');
    });

    it('should export PROXY_PATH', () => {
      expect(schematics.PROXY_PATH).toBe('/proxy');
    });

    it('should export PROXY_CONFIG_PATH', () => {
      expect(schematics.PROXY_CONFIG_PATH).toBe('/proxy/generate-proxy.json');
    });

    it('should export PROXY_WARNING', () => {
      expect(schematics.PROXY_WARNING).toBeDefined();
    });

    it('should export SYSTEM_TYPES', () => {
      expect(schematics.SYSTEM_TYPES).toBeInstanceOf(Map);
    });

    it('should export VOLO_REGEX', () => {
      expect(schematics.VOLO_REGEX).toBeInstanceOf(RegExp);
    });

    it('should export VOLO_NAME_VALUE', () => {
      expect(schematics.VOLO_NAME_VALUE).toBeDefined();
      expect(schematics.VOLO_NAME_VALUE.identifier).toBe('NameValue<T = string>');
    });
  });

  describe('Model Classes', () => {
    it('should export Import class', () => {
      const importItem = new schematics.Import({ path: './test' });
      expect(importItem.path).toBe('./test');
    });

    it('should export Model class', () => {
      const model = new schematics.Model({ namespace: 'Test', path: './test' });
      expect(model.namespace).toBe('Test');
    });

    it('should export Interface class', () => {
      const iface = new schematics.Interface({
        base: null,
        identifier: 'TestDto',
        namespace: 'Test',
        ref: 'Test.TestDto',
      });
      expect(iface.identifier).toBe('TestDto');
    });

    it('should export Property class', () => {
      const property = new schematics.Property({ name: 'id', type: 'string' });
      expect(property.name).toBe('id');
    });

    it('should export Method class', () => {
      const method = new schematics.Method({
        signature: new schematics.Signature({ name: 'test' }),
        body: new schematics.Body({
          method: 'GET',
          responseType: 'void',
          url: '/test',
        }),
      });
      expect(method.signature.name).toBe('test');
    });

    it('should export Signature class', () => {
      const signature = new schematics.Signature({ name: 'test' });
      expect(signature.name).toBe('test');
    });

    it('should export Body class', () => {
      const body = new schematics.Body({
        method: 'GET',
        responseType: 'void',
        url: '/test',
      });
      expect(body.method).toBe('GET');
    });

    it('should export Service class', () => {
      const service = new schematics.Service({
        apiName: 'default',
        name: 'TestService',
        namespace: 'Test',
      });
      expect(service.name).toBe('TestService');
    });
  });
});

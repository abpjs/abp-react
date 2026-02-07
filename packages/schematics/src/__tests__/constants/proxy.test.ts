/**
 * Proxy Constants Tests
 */

import { describe, expect, it } from 'vitest';
import { PROXY_CONFIG_PATH, PROXY_PATH, PROXY_WARNING, PROXY_WARNING_PATH } from '../../constants/proxy';

describe('Proxy Constants', () => {
  describe('PROXY_PATH', () => {
    it('should be the correct path', () => {
      expect(PROXY_PATH).toBe('/proxy');
    });
  });

  describe('PROXY_CONFIG_PATH', () => {
    it('should be the correct config path', () => {
      expect(PROXY_CONFIG_PATH).toBe('/proxy/generate-proxy.json');
    });
  });

  describe('PROXY_WARNING_PATH', () => {
    it('should be the correct warning path', () => {
      expect(PROXY_WARNING_PATH).toBe('/proxy/README.md');
    });
  });

  describe('PROXY_WARNING', () => {
    it('should contain title', () => {
      expect(PROXY_WARNING).toContain('# Proxy Generation Output');
    });

    it('should contain overwrite warning', () => {
      expect(PROXY_WARNING).toContain('will be overwritten');
    });

    it('should mention generate-proxy.json', () => {
      expect(PROXY_WARNING).toContain('generate-proxy.json');
    });

    // v3.2.0 - Important notice about npm publishing
    describe('npm publishing notice (v3.2.0)', () => {
      it('should contain Important Notice header', () => {
        expect(PROXY_WARNING).toContain('**Important Notice:**');
      });

      it('should mention building a module', () => {
        expect(PROXY_WARNING).toContain('building a module');
      });

      it('should mention publishing to npm', () => {
        expect(PROXY_WARNING).toContain('publish to npm');
      });

      it('should mention public-api.ts', () => {
        expect(PROXY_WARNING).toContain('public-api.ts');
      });

      it('should mention barrel exports warning', () => {
        expect(PROXY_WARNING).toContain('barrel exports');
      });

      it('should mention index.ts exports', () => {
        expect(PROXY_WARNING).toContain('index.ts exports');
      });
    });
  });
});

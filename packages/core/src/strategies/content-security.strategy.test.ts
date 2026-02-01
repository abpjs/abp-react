import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  ContentSecurityStrategy,
  LooseContentSecurityStrategy,
  NoContentSecurityStrategy,
  CONTENT_SECURITY_STRATEGY,
} from './content-security.strategy';

describe('ContentSecurityStrategy (v2.4.0)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('LooseContentSecurityStrategy', () => {
    it('should create with nonce', () => {
      const strategy = new LooseContentSecurityStrategy('abc123');
      expect(strategy.nonce).toBe('abc123');
    });

    it('should set nonce attribute on script element', () => {
      const strategy = new LooseContentSecurityStrategy('nonce-value');
      const element = document.createElement('script');
      const setAttributeSpy = vi.spyOn(element, 'setAttribute');

      strategy.applyCSP(element);

      expect(setAttributeSpy).toHaveBeenCalledWith('nonce', 'nonce-value');
    });

    it('should set nonce attribute on style element', () => {
      const strategy = new LooseContentSecurityStrategy('style-nonce');
      const element = document.createElement('style');
      const setAttributeSpy = vi.spyOn(element, 'setAttribute');

      strategy.applyCSP(element);

      expect(setAttributeSpy).toHaveBeenCalledWith('nonce', 'style-nonce');
    });

    it('should extend ContentSecurityStrategy', () => {
      const strategy = new LooseContentSecurityStrategy('test');
      expect(strategy).toBeInstanceOf(ContentSecurityStrategy);
    });
  });

  describe('NoContentSecurityStrategy', () => {
    it('should create without nonce', () => {
      const strategy = new NoContentSecurityStrategy();
      expect(strategy.nonce).toBeUndefined();
    });

    it('should not modify element', () => {
      const strategy = new NoContentSecurityStrategy();
      const element = document.createElement('script');
      const setAttributeSpy = vi.spyOn(element, 'setAttribute');

      strategy.applyCSP(element);

      expect(setAttributeSpy).not.toHaveBeenCalled();
    });

    it('should extend ContentSecurityStrategy', () => {
      const strategy = new NoContentSecurityStrategy();
      expect(strategy).toBeInstanceOf(ContentSecurityStrategy);
    });
  });

  describe('CONTENT_SECURITY_STRATEGY factory', () => {
    describe('Loose', () => {
      it('should create LooseContentSecurityStrategy', () => {
        const strategy = CONTENT_SECURITY_STRATEGY.Loose('my-nonce');
        expect(strategy).toBeInstanceOf(LooseContentSecurityStrategy);
        expect(strategy.nonce).toBe('my-nonce');
      });
    });

    describe('None', () => {
      it('should create NoContentSecurityStrategy', () => {
        const strategy = CONTENT_SECURITY_STRATEGY.None();
        expect(strategy).toBeInstanceOf(NoContentSecurityStrategy);
      });
    });
  });
});

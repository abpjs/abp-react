import { describe, it, expect, vi, afterEach } from 'vitest';
import { CrossOriginStrategy, CROSS_ORIGIN_STRATEGY } from './cross-origin.strategy';

describe('CrossOriginStrategy (v2.4.0)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('CrossOriginStrategy class', () => {
    it('should create with anonymous crossorigin', () => {
      const strategy = new CrossOriginStrategy('anonymous');
      expect(strategy.crossorigin).toBe('anonymous');
      expect(strategy.integrity).toBeUndefined();
    });

    it('should create with use-credentials crossorigin', () => {
      const strategy = new CrossOriginStrategy('use-credentials');
      expect(strategy.crossorigin).toBe('use-credentials');
    });

    it('should create with integrity', () => {
      const strategy = new CrossOriginStrategy('anonymous', 'sha384-abc123');
      expect(strategy.crossorigin).toBe('anonymous');
      expect(strategy.integrity).toBe('sha384-abc123');
    });

    it('should set crossorigin attribute on element', () => {
      const strategy = new CrossOriginStrategy('anonymous');
      const element = document.createElement('script');
      const setAttributeSpy = vi.spyOn(element, 'setAttribute');

      strategy.setCrossOrigin(element);

      expect(setAttributeSpy).toHaveBeenCalledWith('crossorigin', 'anonymous');
    });

    it('should set integrity attribute when provided', () => {
      const strategy = new CrossOriginStrategy('anonymous', 'sha384-xyz');
      const element = document.createElement('script');
      const setAttributeSpy = vi.spyOn(element, 'setAttribute');

      strategy.setCrossOrigin(element);

      expect(setAttributeSpy).toHaveBeenCalledWith('crossorigin', 'anonymous');
      expect(setAttributeSpy).toHaveBeenCalledWith('integrity', 'sha384-xyz');
    });

    it('should not set integrity attribute when not provided', () => {
      const strategy = new CrossOriginStrategy('anonymous');
      const element = document.createElement('script');
      const setAttributeSpy = vi.spyOn(element, 'setAttribute');

      strategy.setCrossOrigin(element);

      expect(setAttributeSpy).toHaveBeenCalledTimes(1);
      expect(setAttributeSpy).toHaveBeenCalledWith('crossorigin', 'anonymous');
    });
  });

  describe('CROSS_ORIGIN_STRATEGY factory', () => {
    describe('Anonymous', () => {
      it('should create anonymous strategy without integrity', () => {
        const strategy = CROSS_ORIGIN_STRATEGY.Anonymous();
        expect(strategy.crossorigin).toBe('anonymous');
        expect(strategy.integrity).toBeUndefined();
      });

      it('should create anonymous strategy with integrity', () => {
        const strategy = CROSS_ORIGIN_STRATEGY.Anonymous('sha384-hash');
        expect(strategy.crossorigin).toBe('anonymous');
        expect(strategy.integrity).toBe('sha384-hash');
      });
    });

    describe('UseCredentials', () => {
      it('should create use-credentials strategy without integrity', () => {
        const strategy = CROSS_ORIGIN_STRATEGY.UseCredentials();
        expect(strategy.crossorigin).toBe('use-credentials');
        expect(strategy.integrity).toBeUndefined();
      });

      it('should create use-credentials strategy with integrity', () => {
        const strategy = CROSS_ORIGIN_STRATEGY.UseCredentials('sha384-hash');
        expect(strategy.crossorigin).toBe('use-credentials');
        expect(strategy.integrity).toBe('sha384-hash');
      });
    });
  });
});

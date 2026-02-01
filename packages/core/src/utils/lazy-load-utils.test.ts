import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fromLazyLoad } from './lazy-load-utils';
import { DOM_STRATEGY } from '../strategies/dom.strategy';
import { CROSS_ORIGIN_STRATEGY } from '../strategies/cross-origin.strategy';

describe('lazy-load-utils (v2.4.0)', () => {
  let mockInsertAdjacentElement: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockInsertAdjacentElement = vi.fn();
    vi.spyOn(document.head, 'insertAdjacentElement').mockImplementation(mockInsertAdjacentElement);
    vi.spyOn(document.body, 'insertAdjacentElement').mockImplementation(mockInsertAdjacentElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fromLazyLoad', () => {
    it('should resolve when script loads', async () => {
      const script = document.createElement('script');
      script.src = 'https://example.com/test.js';

      mockInsertAdjacentElement.mockImplementation((_, element) => {
        setTimeout(() => {
          element.onload?.(new Event('load'));
        }, 0);
      });

      const result = await fromLazyLoad(script);
      expect(result.type).toBe('load');
    });

    it('should reject when script fails to load', async () => {
      const script = document.createElement('script');
      script.src = 'https://example.com/error.js';

      mockInsertAdjacentElement.mockImplementation((_, element) => {
        setTimeout(() => {
          element.onerror?.(new ErrorEvent('error'));
        }, 0);
      });

      await expect(fromLazyLoad(script)).rejects.toBeDefined();
    });

    it('should resolve when link loads', async () => {
      const link = document.createElement('link');
      link.href = 'https://example.com/style.css';
      link.rel = 'stylesheet';

      mockInsertAdjacentElement.mockImplementation((_, element) => {
        setTimeout(() => {
          element.onload?.(new Event('load'));
        }, 0);
      });

      const result = await fromLazyLoad(link);
      expect(result.type).toBe('load');
    });

    it('should use default DOM strategy (AppendToHead)', async () => {
      const script = document.createElement('script');

      mockInsertAdjacentElement.mockImplementation((position, element) => {
        expect(position).toBe('beforeend');
        setTimeout(() => element.onload?.(new Event('load')), 0);
      });

      await fromLazyLoad(script);

      expect(mockInsertAdjacentElement).toHaveBeenCalled();
    });

    it('should use custom DOM strategy', async () => {
      const script = document.createElement('script');
      const customStrategy = DOM_STRATEGY.PrependToHead();

      mockInsertAdjacentElement.mockImplementation((position, element) => {
        expect(position).toBe('afterbegin');
        setTimeout(() => element.onload?.(new Event('load')), 0);
      });

      await fromLazyLoad(script, customStrategy);

      expect(mockInsertAdjacentElement).toHaveBeenCalled();
    });

    it('should apply cross-origin strategy when provided', async () => {
      const script = document.createElement('script');
      const crossOriginStrategy = CROSS_ORIGIN_STRATEGY.Anonymous('sha384-hash');

      mockInsertAdjacentElement.mockImplementation((_, element) => {
        setTimeout(() => element.onload?.(new Event('load')), 0);
      });

      await fromLazyLoad(script, DOM_STRATEGY.AppendToHead(), crossOriginStrategy);

      expect(script.getAttribute('crossorigin')).toBe('anonymous');
      expect(script.getAttribute('integrity')).toBe('sha384-hash');
    });

    it('should not apply cross-origin when not provided', async () => {
      const script = document.createElement('script');

      mockInsertAdjacentElement.mockImplementation((_, element) => {
        setTimeout(() => element.onload?.(new Event('load')), 0);
      });

      await fromLazyLoad(script);

      expect(script.getAttribute('crossorigin')).toBeNull();
    });
  });
});

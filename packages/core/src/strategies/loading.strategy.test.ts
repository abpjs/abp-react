import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ScriptLoadingStrategy,
  StyleLoadingStrategy,
  LOADING_STRATEGY,
} from './loading.strategy';
import { DOM_STRATEGY } from './dom.strategy';
import { CROSS_ORIGIN_STRATEGY } from './cross-origin.strategy';

describe('LoadingStrategy (v2.4.0)', () => {
  let mockInsertAdjacentElement: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockInsertAdjacentElement = vi.fn();
    vi.spyOn(document.head, 'insertAdjacentElement').mockImplementation(mockInsertAdjacentElement);
    vi.spyOn(document.body, 'insertAdjacentElement').mockImplementation(mockInsertAdjacentElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ScriptLoadingStrategy', () => {
    it('should create with path', () => {
      const strategy = new ScriptLoadingStrategy('https://example.com/script.js');
      expect(strategy.path).toBe('https://example.com/script.js');
    });

    it('should create script element with src', () => {
      const strategy = new ScriptLoadingStrategy('https://example.com/lib.js');
      const element = strategy.createElement();

      expect(element.tagName).toBe('SCRIPT');
      expect(element.src).toBe('https://example.com/lib.js');
      expect(element.type).toBe('text/javascript');
    });

    it('should create stream that resolves on load', async () => {
      const strategy = new ScriptLoadingStrategy('https://example.com/test.js');

      // Mock the element creation to capture onload
      let capturedElement: HTMLScriptElement | null = null;
      mockInsertAdjacentElement.mockImplementation((_, element) => {
        capturedElement = element;
        // Simulate load event
        setTimeout(() => {
          if (capturedElement?.onload) {
            capturedElement.onload(new Event('load'));
          }
        }, 0);
      });

      const promise = strategy.createStream();
      const event = await promise;

      expect(event.type).toBe('load');
    });

    it('should create stream that rejects on error', async () => {
      const strategy = new ScriptLoadingStrategy('https://example.com/error.js');

      mockInsertAdjacentElement.mockImplementation((_, element) => {
        setTimeout(() => {
          if (element.onerror) {
            element.onerror(new ErrorEvent('error'));
          }
        }, 0);
      });

      await expect(strategy.createStream()).rejects.toBeDefined();
    });

    it('should apply cross-origin strategy when provided', async () => {
      const crossOrigin = CROSS_ORIGIN_STRATEGY.Anonymous('sha384-hash');
      const strategy = new ScriptLoadingStrategy(
        'https://cdn.example.com/lib.js',
        DOM_STRATEGY.AppendToHead(),
        crossOrigin
      );

      mockInsertAdjacentElement.mockImplementation((_, element) => {
        setTimeout(() => element.onload?.(new Event('load')), 0);
      });

      await strategy.createStream();

      const insertedElement = mockInsertAdjacentElement.mock.calls[0][1];
      expect(insertedElement.getAttribute('crossorigin')).toBe('anonymous');
      expect(insertedElement.getAttribute('integrity')).toBe('sha384-hash');
    });
  });

  describe('StyleLoadingStrategy', () => {
    it('should create with href', () => {
      const strategy = new StyleLoadingStrategy('https://example.com/style.css');
      expect(strategy.path).toBe('https://example.com/style.css');
    });

    it('should create link element with href', () => {
      const strategy = new StyleLoadingStrategy('https://example.com/styles.css');
      const element = strategy.createElement();

      expect(element.tagName).toBe('LINK');
      expect(element.href).toBe('https://example.com/styles.css');
      expect(element.rel).toBe('stylesheet');
      expect(element.type).toBe('text/css');
    });

    it('should create stream that resolves on load', async () => {
      const strategy = new StyleLoadingStrategy('https://example.com/main.css');

      mockInsertAdjacentElement.mockImplementation((_, element) => {
        setTimeout(() => element.onload?.(new Event('load')), 0);
      });

      const event = await strategy.createStream();
      expect(event.type).toBe('load');
    });
  });

  describe('LOADING_STRATEGY factory', () => {
    describe('AppendAnonymousScriptToBody', () => {
      it('should create script strategy targeting body', () => {
        const strategy = LOADING_STRATEGY.AppendAnonymousScriptToBody('https://example.com/app.js');
        expect(strategy).toBeInstanceOf(ScriptLoadingStrategy);
        expect(strategy.path).toBe('https://example.com/app.js');
      });

      it('should include integrity when provided', () => {
        const strategy = LOADING_STRATEGY.AppendAnonymousScriptToBody(
          'https://example.com/app.js',
          'sha384-hash'
        );
        expect(strategy).toBeInstanceOf(ScriptLoadingStrategy);
      });
    });

    describe('AppendAnonymousScriptToHead', () => {
      it('should create script strategy targeting head', () => {
        const strategy = LOADING_STRATEGY.AppendAnonymousScriptToHead('https://example.com/lib.js');
        expect(strategy).toBeInstanceOf(ScriptLoadingStrategy);
        expect(strategy.path).toBe('https://example.com/lib.js');
      });
    });

    describe('AppendAnonymousStyleToHead', () => {
      it('should create style strategy targeting head', () => {
        const strategy = LOADING_STRATEGY.AppendAnonymousStyleToHead('https://example.com/style.css');
        expect(strategy).toBeInstanceOf(StyleLoadingStrategy);
        expect(strategy.path).toBe('https://example.com/style.css');
      });
    });

    describe('PrependAnonymousScriptToHead', () => {
      it('should create script strategy prepending to head', () => {
        const strategy = LOADING_STRATEGY.PrependAnonymousScriptToHead('https://example.com/first.js');
        expect(strategy).toBeInstanceOf(ScriptLoadingStrategy);
        expect(strategy.path).toBe('https://example.com/first.js');
      });
    });

    describe('PrependAnonymousStyleToHead', () => {
      it('should create style strategy prepending to head', () => {
        const strategy = LOADING_STRATEGY.PrependAnonymousStyleToHead('https://example.com/reset.css');
        expect(strategy).toBeInstanceOf(StyleLoadingStrategy);
        expect(strategy.path).toBe('https://example.com/reset.css');
      });
    });
  });
});

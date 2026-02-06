import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LazyLoadService } from './lazy-load.service';
import { ScriptLoadingStrategy, LOADING_STRATEGY } from '../strategies/loading.strategy';

describe('LazyLoadService', () => {
  let service: LazyLoadService;
  let mockInsertAdjacentElement: ReturnType<typeof vi.fn>;
  let mockAppendChild: ReturnType<typeof vi.fn>;
  let createdElements: HTMLElement[];

  beforeEach(() => {
    service = new LazyLoadService();
    createdElements = [];
    mockInsertAdjacentElement = vi.fn();
    mockAppendChild = vi.fn();

    // Mock document.createElement
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = {
        tagName: tagName.toUpperCase(),
        type: '',
        src: '',
        text: '',
        href: '',
        rel: '',
        textContent: '',
        onload: null as (() => void) | null,
        onerror: null as ((error: Error) => void) | null,
      } as unknown as HTMLElement;
      createdElements.push(element);
      return element;
    });

    // Mock document.querySelector
    vi.spyOn(document, 'querySelector').mockImplementation((selector: string) => {
      if (selector === 'body' || selector === 'head') {
        return {
          insertAdjacentElement: mockInsertAdjacentElement,
        } as unknown as Element;
      }
      return null;
    });

    // Mock document.body.appendChild
    vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('load', () => {
    it('should return undefined for null URL and empty content', () => {
      const result = service.load(null, 'script');
      expect(result).toBeUndefined();
    });

    it('should create script element for script type', async () => {
      const promise = service.load('https://example.com/script.js', 'script');

      expect(createdElements).toHaveLength(1);
      expect(createdElements[0].tagName).toBe('SCRIPT');
      expect((createdElements[0] as any).src).toBe('https://example.com/script.js');

      // Trigger onload
      (createdElements[0] as any).onload?.();

      await expect(promise).resolves.toBeUndefined();
    });

    it('should create link element for style type with URL', async () => {
      const promise = service.load('https://example.com/style.css', 'style');

      expect(createdElements).toHaveLength(1);
      expect(createdElements[0].tagName).toBe('LINK');
      expect((createdElements[0] as any).rel).toBe('stylesheet');
      expect((createdElements[0] as any).href).toBe('https://example.com/style.css');

      (createdElements[0] as any).onload?.();
      await expect(promise).resolves.toBeUndefined();
    });

    it('should handle array of URLs (v1.0.0 feature)', async () => {
      const urls = ['https://example.com/script1.js', 'https://example.com/script2.js'];
      const promise = service.load(urls, 'script');

      expect(createdElements).toHaveLength(2);

      // Trigger onload for both
      createdElements.forEach((el) => (el as any).onload?.());

      await expect(promise).resolves.toBeUndefined();
    });

    it('should return undefined for empty array', () => {
      const result = service.load([], 'script');
      expect(result).toBeUndefined();
    });

    it('should cache loaded libraries', async () => {
      const url = 'https://example.com/cached.js';

      const promise1 = service.load(url, 'script');
      (createdElements[0] as any).onload?.();
      await promise1;

      // Second load should return cached promise
      const promise2 = service.load(url, 'script');

      // Should not create new element
      expect(createdElements).toHaveLength(1);
      expect(promise2).toBeDefined();
    });

    it('should reject on error', async () => {
      const promise = service.load('https://example.com/error.js', 'script');

      (createdElements[0] as any).onerror?.();

      await expect(promise).rejects.toThrow('Failed to load');
    });

    it('should append to body when target not found', async () => {
      vi.spyOn(document, 'querySelector').mockReturnValue(null);

      const promise = service.load('https://example.com/script.js', 'script', '', 'nonexistent');

      expect(mockAppendChild).toHaveBeenCalled();

      (createdElements[0] as any).onload?.();
      await promise;
    });

    it('should use insertAdjacentElement with correct position', async () => {
      const promise = service.load(
        'https://example.com/script.js',
        'script',
        '',
        'body',
        'beforeend'
      );

      expect(mockInsertAdjacentElement).toHaveBeenCalledWith('beforeend', expect.any(Object));

      (createdElements[0] as any).onload?.();
      await promise;
    });
  });

  describe('loadScript', () => {
    it('should load script using load method', async () => {
      const promise = service.loadScript('https://example.com/script.js');

      expect(createdElements[0].tagName).toBe('SCRIPT');

      (createdElements[0] as any).onload?.();
      await promise;
    });

    it('should accept array of scripts (v1.0.0)', async () => {
      const promise = service.loadScript([
        'https://example.com/script1.js',
        'https://example.com/script2.js',
      ]);

      expect(createdElements).toHaveLength(2);

      createdElements.forEach((el) => (el as any).onload?.());
      await promise;
    });
  });

  describe('loadStyle', () => {
    it('should load style using load method', async () => {
      const promise = service.loadStyle('https://example.com/style.css');

      expect(createdElements[0].tagName).toBe('LINK');

      (createdElements[0] as any).onload?.();
      await promise;
    });

    it('should accept array of styles (v1.0.0)', async () => {
      const promise = service.loadStyle([
        'https://example.com/style1.css',
        'https://example.com/style2.css',
      ]);

      expect(createdElements).toHaveLength(2);

      createdElements.forEach((el) => (el as any).onload?.());
      await promise;
    });
  });

  describe('load with LoadingStrategy (v2.4.0, updated v2.9.0)', () => {
    it('should have loaded map (v2.9.0 change from Set to Map)', () => {
      expect(service.loaded).toBeDefined();
      expect(service.loaded).toBeInstanceOf(Map);
    });

    it('should track loaded paths with element reference in loaded map', async () => {
      const strategy = LOADING_STRATEGY.AppendAnonymousScriptToHead(
        'https://example.com/tracked.js'
      );

      // Mock element that will be stored
      const mockElement = document.createElement('script');
      strategy.element = mockElement;

      // Mock createStream to resolve immediately
      vi.spyOn(strategy, 'createStream').mockImplementation(async () => {
        strategy.element = mockElement;
        return new Event('load');
      });

      await service.load(strategy);

      expect(service.loaded.has('https://example.com/tracked.js')).toBe(true);
      expect(service.loaded.get('https://example.com/tracked.js')).toBe(mockElement);
    });

    it('should return cached result for already loaded path', async () => {
      const strategy = LOADING_STRATEGY.AppendAnonymousScriptToHead(
        'https://example.com/cached-strategy.js'
      );

      const mockElement = document.createElement('script');
      const createStreamSpy = vi.spyOn(strategy, 'createStream').mockImplementation(async () => {
        strategy.element = mockElement;
        return new Event('load');
      });

      // First load
      await service.load(strategy);
      expect(createStreamSpy).toHaveBeenCalledTimes(1);

      // Second load should return cached
      const strategy2 = LOADING_STRATEGY.AppendAnonymousScriptToHead(
        'https://example.com/cached-strategy.js'
      );

      const result = await service.load(strategy2);
      expect(result.type).toBe('load');
      // createStream should not be called again for same path
    });

    it('should retry on failure', async () => {
      const strategy = LOADING_STRATEGY.AppendAnonymousScriptToHead(
        'https://example.com/retry.js'
      );

      let attempts = 0;
      vi.spyOn(strategy, 'createStream').mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve(new Event('load'));
      });

      const result = await service.load(strategy, 3, 10);
      expect(result.type).toBe('load');
      expect(attempts).toBe(3);
    });

    it('should throw after all retries fail', async () => {
      const strategy = LOADING_STRATEGY.AppendAnonymousScriptToHead(
        'https://example.com/fail.js'
      );

      vi.spyOn(strategy, 'createStream').mockRejectedValue(new Error('Always fails'));

      await expect(service.load(strategy, 2, 10)).rejects.toThrow('Always fails');
    });

    it('should use default retry values', async () => {
      const strategy = LOADING_STRATEGY.AppendAnonymousScriptToHead(
        'https://example.com/default-retry.js'
      );

      vi.spyOn(strategy, 'createStream').mockResolvedValue(new Event('load'));

      // Call without retry parameters to use defaults
      const result = await service.load(strategy);
      expect(result.type).toBe('load');
    });
  });

  describe('isLoaded (v2.4.0)', () => {
    it('should return false for unloaded path', () => {
      expect(service.isLoaded('https://example.com/notloaded.js')).toBe(false);
    });

    it('should return true for loaded path via strategy', async () => {
      const strategy = LOADING_STRATEGY.AppendAnonymousScriptToHead(
        'https://example.com/isloaded-test.js'
      );

      const mockElement = document.createElement('script');
      vi.spyOn(strategy, 'createStream').mockImplementation(async () => {
        strategy.element = mockElement;
        return new Event('load');
      });

      await service.load(strategy);

      expect(service.isLoaded('https://example.com/isloaded-test.js')).toBe(true);
    });

    it('should return true for loaded path via legacy method', async () => {
      const promise = service.load('https://example.com/legacy-loaded.js', 'script');
      (createdElements[0] as any).onload?.();
      await promise;

      expect(service.isLoaded('legacy-loaded.js')).toBe(true);
    });
  });
});

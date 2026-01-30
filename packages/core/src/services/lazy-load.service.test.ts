import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LazyLoadService } from './lazy-load.service';

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
});

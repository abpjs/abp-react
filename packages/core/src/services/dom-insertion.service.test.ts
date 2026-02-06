import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DomInsertionService, getDomInsertionService } from './dom-insertion.service';
import { CONTENT_STRATEGY } from '../strategies/content.strategy';

describe('DomInsertionService (v2.7.0)', () => {
  let service: DomInsertionService;
  let mockInsertAdjacentElement: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    service = new DomInsertionService();
    mockInsertAdjacentElement = vi.fn();
    vi.spyOn(document.head, 'insertAdjacentElement').mockImplementation(mockInsertAdjacentElement);
    vi.spyOn(document.body, 'insertAdjacentElement').mockImplementation(mockInsertAdjacentElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('DomInsertionService', () => {
    it('should start with no inserted content', () => {
      expect(service.has('any')).toBe(false);
    });

    it('should insert content using content strategy', () => {
      const strategy = CONTENT_STRATEGY.AppendStyleToHead('.test { color: red; }');
      service.insertContent(strategy);

      expect(mockInsertAdjacentElement).toHaveBeenCalled();
      expect(service.has('.test { color: red; }')).toBe(true);
    });

    it('should track inserted content using has()', () => {
      const strategy = CONTENT_STRATEGY.AppendStyleToHead('.class1 { }');
      service.insertContent(strategy);

      expect(service.has('.class1 { }')).toBe(true);
      expect(service.has('.class2 { }')).toBe(false);
    });

    it('should track inserted content using hasInserted() (deprecated)', () => {
      const strategy = CONTENT_STRATEGY.AppendStyleToHead('.class1 { }');
      service.insertContent(strategy);

      expect(service.hasInserted('.class1 { }')).toBe(true);
      expect(service.hasInserted('.class2 { }')).toBe(false);
    });

    it('should prevent duplicate insertions', () => {
      const content = '.duplicate { color: blue; }';
      const strategy1 = CONTENT_STRATEGY.AppendStyleToHead(content);
      const strategy2 = CONTENT_STRATEGY.AppendStyleToHead(content);

      service.insertContent(strategy1);
      service.insertContent(strategy2);

      // Should only insert once
      expect(mockInsertAdjacentElement).toHaveBeenCalledTimes(1);
      expect(service.has(content)).toBe(true);
    });

    it('should allow different content to be inserted', () => {
      const strategy1 = CONTENT_STRATEGY.AppendStyleToHead('.style1 { }');
      const strategy2 = CONTENT_STRATEGY.AppendStyleToHead('.style2 { }');

      service.insertContent(strategy1);
      service.insertContent(strategy2);

      expect(mockInsertAdjacentElement).toHaveBeenCalledTimes(2);
      expect(service.has('.style1 { }')).toBe(true);
      expect(service.has('.style2 { }')).toBe(true);
    });

    it('should clear tracking set', () => {
      const strategy = CONTENT_STRATEGY.AppendStyleToHead('.test { }');
      service.insertContent(strategy);

      expect(service.has('.test { }')).toBe(true);

      service.clear();

      expect(service.has('.test { }')).toBe(false);
    });

    it('should work with script content strategy', () => {
      const strategy = CONTENT_STRATEGY.AppendScriptToBody('console.log("test");');
      service.insertContent(strategy);

      expect(mockInsertAdjacentElement).toHaveBeenCalled();
      const insertedElement = mockInsertAdjacentElement.mock.calls[0][1];
      expect(insertedElement.tagName).toBe('SCRIPT');
    });

    it('should return the inserted element (v2.7.0)', () => {
      const strategy = CONTENT_STRATEGY.AppendStyleToHead('.return-test { }');
      const element = service.insertContent(strategy);

      expect(element).toBeDefined();
      expect(element.tagName).toBe('STYLE');
      expect(element.textContent).toBe('.return-test { }');
    });

    it('should remove content from DOM using removeContent() (v2.7.0)', () => {
      const mockElement = document.createElement('style');
      const mockParent = document.createElement('div');
      mockParent.appendChild(mockElement);

      const removeChildSpy = vi.spyOn(mockParent, 'removeChild');

      service.removeContent(mockElement);

      expect(removeChildSpy).toHaveBeenCalledWith(mockElement);
    });

    it('should handle removeContent() when element has no parent (v2.7.0)', () => {
      const mockElement = document.createElement('style');

      // Should not throw
      expect(() => service.removeContent(mockElement)).not.toThrow();
    });
  });

  describe('getDomInsertionService', () => {
    it('should return singleton instance', () => {
      const instance1 = getDomInsertionService();
      const instance2 = getDomInsertionService();

      expect(instance1).toBe(instance2);
    });

    it('should return DomInsertionService instance', () => {
      const instance = getDomInsertionService();
      expect(instance).toBeInstanceOf(DomInsertionService);
    });
  });
});

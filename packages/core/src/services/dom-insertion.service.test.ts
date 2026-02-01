import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DomInsertionService, getDomInsertionService } from './dom-insertion.service';
import { CONTENT_STRATEGY, StyleContentStrategy } from '../strategies/content.strategy';

describe('DomInsertionService (v2.4.0)', () => {
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
    it('should start with empty inserted set', () => {
      expect(service.inserted.size).toBe(0);
    });

    it('should insert content using content strategy', () => {
      const strategy = CONTENT_STRATEGY.AppendStyleToHead('.test { color: red; }');
      service.insertContent(strategy);

      expect(mockInsertAdjacentElement).toHaveBeenCalled();
      expect(service.inserted.has('.test { color: red; }')).toBe(true);
    });

    it('should track inserted content', () => {
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
      expect(service.inserted.size).toBe(1);
    });

    it('should allow different content to be inserted', () => {
      const strategy1 = CONTENT_STRATEGY.AppendStyleToHead('.style1 { }');
      const strategy2 = CONTENT_STRATEGY.AppendStyleToHead('.style2 { }');

      service.insertContent(strategy1);
      service.insertContent(strategy2);

      expect(mockInsertAdjacentElement).toHaveBeenCalledTimes(2);
      expect(service.inserted.size).toBe(2);
    });

    it('should clear tracking set', () => {
      const strategy = CONTENT_STRATEGY.AppendStyleToHead('.test { }');
      service.insertContent(strategy);

      expect(service.inserted.size).toBe(1);

      service.clear();

      expect(service.inserted.size).toBe(0);
      expect(service.hasInserted('.test { }')).toBe(false);
    });

    it('should work with script content strategy', () => {
      const strategy = CONTENT_STRATEGY.AppendScriptToBody('console.log("test");');
      service.insertContent(strategy);

      expect(mockInsertAdjacentElement).toHaveBeenCalled();
      const insertedElement = mockInsertAdjacentElement.mock.calls[0][1];
      expect(insertedElement.tagName).toBe('SCRIPT');
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

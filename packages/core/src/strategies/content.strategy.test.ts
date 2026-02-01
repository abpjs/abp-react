import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  StyleContentStrategy,
  ScriptContentStrategy,
  CONTENT_STRATEGY,
} from './content.strategy';
import { DOM_STRATEGY } from './dom.strategy';

describe('ContentStrategy (v2.4.0)', () => {
  let mockInsertAdjacentElement: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockInsertAdjacentElement = vi.fn();

    // Mock head and body insertAdjacentElement
    vi.spyOn(document.head, 'insertAdjacentElement').mockImplementation(mockInsertAdjacentElement);
    vi.spyOn(document.body, 'insertAdjacentElement').mockImplementation(mockInsertAdjacentElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('StyleContentStrategy', () => {
    it('should create style element with content', () => {
      const strategy = new StyleContentStrategy('body { color: red; }');
      const element = strategy.createElement();

      expect(element.tagName).toBe('STYLE');
      expect(element.textContent).toBe('body { color: red; }');
    });

    it('should insert element using DOM strategy', () => {
      const strategy = new StyleContentStrategy('.test { }', DOM_STRATEGY.AppendToHead());
      strategy.insertElement();

      expect(mockInsertAdjacentElement).toHaveBeenCalled();
      const insertedElement = mockInsertAdjacentElement.mock.calls[0][1];
      expect(insertedElement.tagName).toBe('STYLE');
    });
  });

  describe('ScriptContentStrategy', () => {
    it('should create script element with content', () => {
      const strategy = new ScriptContentStrategy('console.log("hello");');
      const element = strategy.createElement();

      expect(element.tagName).toBe('SCRIPT');
      expect(element.textContent).toBe('console.log("hello");');
    });

    it('should insert element using DOM strategy', () => {
      const strategy = new ScriptContentStrategy('var x = 1;', DOM_STRATEGY.AppendToBody());
      strategy.insertElement();

      expect(mockInsertAdjacentElement).toHaveBeenCalled();
      const insertedElement = mockInsertAdjacentElement.mock.calls[0][1];
      expect(insertedElement.tagName).toBe('SCRIPT');
    });
  });

  describe('CONTENT_STRATEGY factory', () => {
    describe('AppendScriptToBody', () => {
      it('should create ScriptContentStrategy targeting body', () => {
        const strategy = CONTENT_STRATEGY.AppendScriptToBody('var a = 1;');
        expect(strategy).toBeInstanceOf(ScriptContentStrategy);
        expect(strategy.content).toBe('var a = 1;');
      });
    });

    describe('AppendScriptToHead', () => {
      it('should create ScriptContentStrategy targeting head', () => {
        const strategy = CONTENT_STRATEGY.AppendScriptToHead('var b = 2;');
        expect(strategy).toBeInstanceOf(ScriptContentStrategy);
        expect(strategy.content).toBe('var b = 2;');
      });
    });

    describe('AppendStyleToHead', () => {
      it('should create StyleContentStrategy appending to head', () => {
        const strategy = CONTENT_STRATEGY.AppendStyleToHead('.class { }');
        expect(strategy).toBeInstanceOf(StyleContentStrategy);
        expect(strategy.content).toBe('.class { }');
      });
    });

    describe('PrependStyleToHead', () => {
      it('should create StyleContentStrategy prepending to head', () => {
        const strategy = CONTENT_STRATEGY.PrependStyleToHead('.first { }');
        expect(strategy).toBeInstanceOf(StyleContentStrategy);
        expect(strategy.content).toBe('.first { }');
      });
    });
  });
});

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DomStrategy, DOM_STRATEGY } from './dom.strategy';

describe('DomStrategy (v2.4.0)', () => {
  let mockInsertAdjacentElement: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockInsertAdjacentElement = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('DomStrategy class', () => {
    it('should create with default values', () => {
      const strategy = new DomStrategy();
      expect(strategy.target).toBe(document.head);
      expect(strategy.position).toBe('beforeend');
    });

    it('should create with custom target and position', () => {
      const customTarget = document.createElement('div');
      const strategy = new DomStrategy(customTarget, 'afterbegin');
      expect(strategy.target).toBe(customTarget);
      expect(strategy.position).toBe('afterbegin');
    });

    it('should insert element at specified position', () => {
      const target = {
        insertAdjacentElement: mockInsertAdjacentElement,
      } as unknown as HTMLElement;

      const strategy = new DomStrategy(target, 'beforeend');
      const element = document.createElement('script');

      strategy.insertElement(element);

      expect(mockInsertAdjacentElement).toHaveBeenCalledWith('beforeend', element);
    });
  });

  describe('DOM_STRATEGY factory', () => {
    describe('AfterElement', () => {
      it('should create strategy with afterend position', () => {
        const refElement = document.createElement('div');
        const strategy = DOM_STRATEGY.AfterElement(refElement);

        expect(strategy.target).toBe(refElement);
        expect(strategy.position).toBe('afterend');
      });
    });

    describe('AppendToBody', () => {
      it('should create strategy targeting body with beforeend position', () => {
        const strategy = DOM_STRATEGY.AppendToBody();

        expect(strategy.target).toBe(document.body);
        expect(strategy.position).toBe('beforeend');
      });
    });

    describe('AppendToHead', () => {
      it('should create strategy targeting head with beforeend position', () => {
        const strategy = DOM_STRATEGY.AppendToHead();

        expect(strategy.target).toBe(document.head);
        expect(strategy.position).toBe('beforeend');
      });
    });

    describe('BeforeElement', () => {
      it('should create strategy with beforebegin position', () => {
        const refElement = document.createElement('div');
        const strategy = DOM_STRATEGY.BeforeElement(refElement);

        expect(strategy.target).toBe(refElement);
        expect(strategy.position).toBe('beforebegin');
      });
    });

    describe('PrependToHead', () => {
      it('should create strategy targeting head with afterbegin position', () => {
        const strategy = DOM_STRATEGY.PrependToHead();

        expect(strategy.target).toBe(document.head);
        expect(strategy.position).toBe('afterbegin');
      });
    });
  });
});

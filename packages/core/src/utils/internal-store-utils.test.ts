/**
 * Tests for internal-store-utils
 * @since 3.2.0
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InternalStore } from './internal-store-utils';

interface TestState {
  count: number;
  name: string;
  nested: {
    value: number;
    active: boolean;
  };
  items: string[];
}

const createInitialState = (): TestState => ({
  count: 0,
  name: 'initial',
  nested: {
    value: 10,
    active: false,
  },
  items: ['a', 'b'],
});

describe('InternalStore (v3.2.0)', () => {
  let store: InternalStore<TestState>;

  beforeEach(() => {
    store = new InternalStore(createInitialState());
  });

  describe('constructor', () => {
    it('should initialize with the provided state', () => {
      expect(store.state).toEqual(createInitialState());
    });

    it('should create a copy of the initial state', () => {
      const initial = createInitialState();
      const testStore = new InternalStore(initial);

      initial.count = 999;

      expect(testStore.state.count).toBe(0);
    });
  });

  describe('state getter', () => {
    it('should return current state', () => {
      expect(store.state.count).toBe(0);
      expect(store.state.name).toBe('initial');
    });

    it('should return a copy of the state', () => {
      const state1 = store.state;
      const state2 = store.state;

      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });

    it('should not be affected by external mutations', () => {
      const state = store.state;
      state.count = 999;

      expect(store.state.count).toBe(0);
    });
  });

  describe('patch', () => {
    it('should update a single property', () => {
      store.patch({ count: 5 });

      expect(store.state.count).toBe(5);
      expect(store.state.name).toBe('initial');
    });

    it('should update multiple properties', () => {
      store.patch({ count: 10, name: 'updated' });

      expect(store.state.count).toBe(10);
      expect(store.state.name).toBe('updated');
    });

    it('should deep merge nested objects', () => {
      store.patch({ nested: { value: 20 } });

      expect(store.state.nested.value).toBe(20);
      expect(store.state.nested.active).toBe(false);
    });

    it('should handle multiple nested updates', () => {
      store.patch({ nested: { active: true } });
      store.patch({ nested: { value: 30 } });

      expect(store.state.nested.value).toBe(30);
      expect(store.state.nested.active).toBe(true);
    });

    it('should replace arrays', () => {
      store.patch({ items: ['x', 'y', 'z'] });

      expect(store.state.items).toEqual(['x', 'y', 'z']);
    });

    it('should notify state listeners', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.patch({ count: 5 });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ count: 5 })
      );
    });
  });

  describe('reset', () => {
    it('should reset state to initial values', () => {
      store.patch({ count: 100, name: 'changed' });
      store.reset();

      expect(store.state).toEqual(createInitialState());
    });

    it('should notify listeners on reset', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.patch({ count: 50 });
      listener.mockClear();

      store.reset();

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(createInitialState());
    });
  });

  describe('subscribe', () => {
    it('should add a listener', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.patch({ count: 1 });

      expect(listener).toHaveBeenCalled();
    });

    it('should return an unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should stop calling listener after unsubscribe', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      store.patch({ count: 1 });
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      store.patch({ count: 2 });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should support multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      store.subscribe(listener1);
      store.subscribe(listener2);

      store.patch({ count: 5 });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should only unsubscribe the specific listener', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const unsubscribe1 = store.subscribe(listener1);
      store.subscribe(listener2);

      unsubscribe1();

      store.patch({ count: 5 });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('sliceState', () => {
    it('should return get and subscribe methods', () => {
      const slice = store.sliceState((s) => s.count);

      expect(typeof slice.get).toBe('function');
      expect(typeof slice.subscribe).toBe('function');
    });

    it('should get the sliced value', () => {
      const slice = store.sliceState((s) => s.count);

      expect(slice.get()).toBe(0);
    });

    it('should call listener when slice changes', () => {
      const listener = vi.fn();
      const slice = store.sliceState((s) => s.count);
      slice.subscribe(listener);

      store.patch({ count: 10 });

      expect(listener).toHaveBeenCalledWith(10);
    });

    it('should not call listener when slice does not change', () => {
      const listener = vi.fn();
      const slice = store.sliceState((s) => s.count);
      slice.subscribe(listener);

      store.patch({ name: 'changed' });

      expect(listener).not.toHaveBeenCalled();
    });

    it('should use custom comparison function', () => {
      const listener = vi.fn();
      const slice = store.sliceState(
        (s) => s.nested,
        (a, b) => a.value === b.value
      );
      slice.subscribe(listener);

      // Change active but not value - should not trigger
      store.patch({ nested: { active: true } });
      expect(listener).not.toHaveBeenCalled();

      // Change value - should trigger
      store.patch({ nested: { value: 50 } });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const slice = store.sliceState((s) => s.count);
      const unsubscribe = slice.subscribe(listener);

      unsubscribe();

      store.patch({ count: 100 });

      expect(listener).not.toHaveBeenCalled();
    });

    it('should track previous value correctly', () => {
      const values: number[] = [];
      const slice = store.sliceState((s) => s.count);
      slice.subscribe((v) => values.push(v));

      store.patch({ count: 1 });
      store.patch({ count: 1 }); // Same value - should not trigger
      store.patch({ count: 2 });
      store.patch({ count: 2 }); // Same value - should not trigger
      store.patch({ count: 3 });

      expect(values).toEqual([1, 2, 3]);
    });
  });

  describe('sliceUpdate', () => {
    it('should return subscribe method', () => {
      const slice = store.sliceUpdate((s) => s.count);

      expect(typeof slice.subscribe).toBe('function');
    });

    it('should call listener with update slice', () => {
      const listener = vi.fn();
      const slice = store.sliceUpdate((s) => s.count);
      slice.subscribe(listener);

      store.patch({ count: 10 });

      expect(listener).toHaveBeenCalledWith(10);
    });

    it('should filter updates using filterFn', () => {
      const listener = vi.fn();
      const slice = store.sliceUpdate(
        (s) => s.count,
        (count) => count !== undefined && count > 5
      );
      slice.subscribe(listener);

      store.patch({ count: 3 }); // Filtered out
      expect(listener).not.toHaveBeenCalled();

      store.patch({ count: 10 }); // Passes filter
      expect(listener).toHaveBeenCalledWith(10);
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const slice = store.sliceUpdate((s) => s.count);
      const unsubscribe = slice.subscribe(listener);

      unsubscribe();

      store.patch({ count: 100 });

      expect(listener).not.toHaveBeenCalled();
    });

    it('should call listener for each update', () => {
      const listener = vi.fn();
      const slice = store.sliceUpdate((s) => s.name);
      slice.subscribe(listener);

      store.patch({ name: 'first' });
      store.patch({ name: 'second' });
      store.patch({ name: 'third' });

      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener).toHaveBeenNthCalledWith(1, 'first');
      expect(listener).toHaveBeenNthCalledWith(2, 'second');
      expect(listener).toHaveBeenNthCalledWith(3, 'third');
    });

    it('should handle nested slice updates', () => {
      const listener = vi.fn();
      const slice = store.sliceUpdate((s) => s.nested?.value);
      slice.subscribe(listener);

      store.patch({ nested: { value: 50 } });

      expect(listener).toHaveBeenCalledWith(50);
    });
  });

  describe('complex scenarios', () => {
    it('should handle rapid sequential updates', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      for (let i = 0; i < 100; i++) {
        store.patch({ count: i });
      }

      expect(listener).toHaveBeenCalledTimes(100);
      expect(store.state.count).toBe(99);
    });

    it('should maintain consistency across multiple slices', () => {
      const countListener = vi.fn();
      const nameListener = vi.fn();

      const countSlice = store.sliceState((s) => s.count);
      const nameSlice = store.sliceState((s) => s.name);

      countSlice.subscribe(countListener);
      nameSlice.subscribe(nameListener);

      store.patch({ count: 5, name: 'both' });

      expect(countListener).toHaveBeenCalledWith(5);
      expect(nameListener).toHaveBeenCalledWith('both');
    });

    it('should handle reset after complex updates', () => {
      store.patch({ count: 100 });
      store.patch({ nested: { value: 500, active: true } });
      store.patch({ items: ['x'] });

      store.reset();

      expect(store.state).toEqual(createInitialState());
    });
  });
});

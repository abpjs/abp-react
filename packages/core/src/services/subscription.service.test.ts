import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SubscriptionService, useSubscription } from './subscription.service';

describe('SubscriptionService (v3.1.0)', () => {
  let service: SubscriptionService;

  beforeEach(() => {
    service = new SubscriptionService();
  });

  describe('initial state', () => {
    it('should be closed (empty) initially', () => {
      expect(service.isClosed).toBe(true);
    });
  });

  describe('isClosed', () => {
    it('should return true when no subscriptions', () => {
      expect(service.isClosed).toBe(true);
    });

    it('should return false when there are subscriptions', () => {
      service.addOne(() => () => {});
      expect(service.isClosed).toBe(false);
    });

    it('should return true after closeAll', () => {
      service.addOne(() => () => {});
      service.addOne(() => () => {});
      service.closeAll();
      expect(service.isClosed).toBe(true);
    });
  });

  describe('addOne', () => {
    it('should add a subscription', () => {
      const cleanup = vi.fn();
      const subscription = service.addOne(() => cleanup);

      expect(service.isClosed).toBe(false);
      expect(subscription).toBeDefined();
      expect(subscription.closed).toBe(false);
    });

    it('should call the factory function immediately', () => {
      const factory = vi.fn(() => () => {});
      service.addOne(factory);

      expect(factory).toHaveBeenCalledTimes(1);
    });

    it('should return subscription with unsubscribe function', () => {
      const cleanup = vi.fn();
      const subscription = service.addOne(() => cleanup);

      expect(typeof subscription.unsubscribe).toBe('function');
    });

    it('should handle factory that returns void', () => {
      const factory = vi.fn();
      const subscription = service.addOne(factory);

      expect(subscription).toBeDefined();
      // unsubscribe should be a no-op function
      expect(() => subscription.unsubscribe()).not.toThrow();
    });

    it('should add multiple subscriptions', () => {
      const cleanup1 = vi.fn();
      const cleanup2 = vi.fn();
      const cleanup3 = vi.fn();

      service.addOne(() => cleanup1);
      service.addOne(() => cleanup2);
      service.addOne(() => cleanup3);

      expect(service.isClosed).toBe(false);
    });
  });

  describe('closeAll', () => {
    it('should call all cleanup functions', () => {
      const cleanup1 = vi.fn();
      const cleanup2 = vi.fn();
      const cleanup3 = vi.fn();

      service.addOne(() => cleanup1);
      service.addOne(() => cleanup2);
      service.addOne(() => cleanup3);

      service.closeAll();

      expect(cleanup1).toHaveBeenCalledTimes(1);
      expect(cleanup2).toHaveBeenCalledTimes(1);
      expect(cleanup3).toHaveBeenCalledTimes(1);
    });

    it('should mark all subscriptions as closed', () => {
      const sub1 = service.addOne(() => () => {});
      const sub2 = service.addOne(() => () => {});

      service.closeAll();

      expect(sub1.closed).toBe(true);
      expect(sub2.closed).toBe(true);
    });

    it('should clear all subscriptions', () => {
      service.addOne(() => () => {});
      service.addOne(() => () => {});

      service.closeAll();

      expect(service.isClosed).toBe(true);
    });

    it('should not call cleanup twice on subsequent closeAll calls', () => {
      const cleanup = vi.fn();
      service.addOne(() => cleanup);

      service.closeAll();
      service.closeAll();

      expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it('should handle empty service', () => {
      expect(() => service.closeAll()).not.toThrow();
    });
  });

  describe('closeOne', () => {
    it('should close specific subscription', () => {
      const cleanup1 = vi.fn();
      const cleanup2 = vi.fn();

      const sub1 = service.addOne(() => cleanup1);
      service.addOne(() => cleanup2);

      service.closeOne(sub1);

      expect(cleanup1).toHaveBeenCalledTimes(1);
      expect(cleanup2).not.toHaveBeenCalled();
      expect(sub1.closed).toBe(true);
    });

    it('should remove subscription from set', () => {
      const sub1 = service.addOne(() => () => {});
      const sub2 = service.addOne(() => () => {});

      service.closeOne(sub1);
      service.closeOne(sub2);

      expect(service.isClosed).toBe(true);
    });

    it('should handle null subscription', () => {
      expect(() => service.closeOne(null)).not.toThrow();
    });

    it('should handle undefined subscription', () => {
      expect(() => service.closeOne(undefined)).not.toThrow();
    });

    it('should not close already closed subscription', () => {
      const cleanup = vi.fn();
      const sub = service.addOne(() => cleanup);

      service.closeOne(sub);
      service.closeOne(sub);

      expect(cleanup).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeOne', () => {
    it('should remove subscription without calling cleanup', () => {
      const cleanup = vi.fn();
      const sub = service.addOne(() => cleanup);

      service.removeOne(sub);

      expect(cleanup).not.toHaveBeenCalled();
      expect(service.isClosed).toBe(true);
    });

    it('should handle null subscription', () => {
      expect(() => service.removeOne(null)).not.toThrow();
    });

    it('should handle undefined subscription', () => {
      expect(() => service.removeOne(undefined)).not.toThrow();
    });

    it('should only remove the specified subscription', () => {
      const sub1 = service.addOne(() => () => {});
      const sub2 = service.addOne(() => () => {});

      service.removeOne(sub1);

      // sub2 should still be in the set
      expect(service.isClosed).toBe(false);
    });
  });

  describe('reset', () => {
    it('should close all and clear subscriptions', () => {
      const cleanup1 = vi.fn();
      const cleanup2 = vi.fn();

      service.addOne(() => cleanup1);
      service.addOne(() => cleanup2);

      service.reset();

      expect(cleanup1).toHaveBeenCalledTimes(1);
      expect(cleanup2).toHaveBeenCalledTimes(1);
      expect(service.isClosed).toBe(true);
    });

    it('should behave same as closeAll', () => {
      const cleanup = vi.fn();
      service.addOne(() => cleanup);

      service.reset();

      expect(cleanup).toHaveBeenCalledTimes(1);
      expect(service.isClosed).toBe(true);
    });
  });

  describe('destroy', () => {
    it('should close all subscriptions', () => {
      const cleanup1 = vi.fn();
      const cleanup2 = vi.fn();

      service.addOne(() => cleanup1);
      service.addOne(() => cleanup2);

      service.destroy();

      expect(cleanup1).toHaveBeenCalledTimes(1);
      expect(cleanup2).toHaveBeenCalledTimes(1);
      expect(service.isClosed).toBe(true);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle event listener cleanup pattern', () => {
      const addListener = vi.fn();
      const removeListener = vi.fn();

      service.addOne(() => {
        addListener('resize');
        return () => removeListener('resize');
      });

      expect(addListener).toHaveBeenCalledWith('resize');
      expect(removeListener).not.toHaveBeenCalled();

      service.closeAll();

      expect(removeListener).toHaveBeenCalledWith('resize');
    });

    it('should handle interval cleanup pattern', () => {
      const clearInterval = vi.fn();
      const intervalId = 123;

      service.addOne(() => {
        // Simulate setInterval returning an id
        return () => clearInterval(intervalId);
      });

      service.closeAll();

      expect(clearInterval).toHaveBeenCalledWith(intervalId);
    });

    it('should handle mixed subscription types', () => {
      const eventCleanup = vi.fn();
      const intervalCleanup = vi.fn();
      const subscriptionCleanup = vi.fn();

      service.addOne(() => eventCleanup);
      service.addOne(() => intervalCleanup);
      service.addOne(() => subscriptionCleanup);

      service.closeAll();

      expect(eventCleanup).toHaveBeenCalledTimes(1);
      expect(intervalCleanup).toHaveBeenCalledTimes(1);
      expect(subscriptionCleanup).toHaveBeenCalledTimes(1);
    });
  });
});

describe('useSubscription (v3.1.0)', () => {
  it('should return a new SubscriptionService instance', () => {
    const result = useSubscription();

    expect(result).toBeInstanceOf(SubscriptionService);
  });

  it('should return different instances on each call', () => {
    const result1 = useSubscription();
    const result2 = useSubscription();

    expect(result1).not.toBe(result2);
  });

  it('should return functional subscription service', () => {
    const service = useSubscription();
    const cleanup = vi.fn();

    service.addOne(() => cleanup);
    service.closeAll();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});

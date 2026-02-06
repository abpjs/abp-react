/**
 * Tests for ListService
 * @since 2.9.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ListService, LIST_QUERY_DEBOUNCE_TIME } from '../../services/list.service';

describe('ListService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('constants', () => {
    it('should export LIST_QUERY_DEBOUNCE_TIME as 300', () => {
      expect(LIST_QUERY_DEBOUNCE_TIME).toBe(300);
    });
  });

  describe('constructor', () => {
    it('should create instance with default delay', () => {
      const service = new ListService();
      expect(service).toBeInstanceOf(ListService);
    });

    it('should create instance with custom delay', () => {
      const service = new ListService(500);
      expect(service).toBeInstanceOf(ListService);
    });
  });

  describe('default values', () => {
    it('should have empty filter by default', () => {
      const service = new ListService();
      expect(service.filter).toBe('');
    });

    it('should have maxResultCount of 10 by default', () => {
      const service = new ListService();
      expect(service.maxResultCount).toBe(10);
    });

    it('should have page 0 by default', () => {
      const service = new ListService();
      expect(service.page).toBe(0);
    });

    it('should have empty sortKey by default', () => {
      const service = new ListService();
      expect(service.sortKey).toBe('');
    });

    it('should have empty sortOrder by default', () => {
      const service = new ListService();
      expect(service.sortOrder).toBe('');
    });

    it('should not be loading by default', () => {
      const service = new ListService();
      expect(service.isLoading).toBe(false);
    });
  });

  describe('filter property', () => {
    it('should update filter value', () => {
      const service = new ListService();
      service.filter = 'test';
      expect(service.filter).toBe('test');
    });

    it('should not schedule query if value is the same', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.filter = '';
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should schedule query when filter changes', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.filter = 'search';
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('maxResultCount property', () => {
    it('should update maxResultCount value', () => {
      const service = new ListService();
      service.maxResultCount = 25;
      expect(service.maxResultCount).toBe(25);
    });

    it('should schedule query when maxResultCount changes', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.maxResultCount = 20;
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('page property', () => {
    it('should update page value', () => {
      const service = new ListService();
      service.page = 2;
      expect(service.page).toBe(2);
    });

    it('should schedule query when page changes', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.page = 1;
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('sortKey property', () => {
    it('should update sortKey value', () => {
      const service = new ListService();
      service.sortKey = 'name';
      expect(service.sortKey).toBe('name');
    });

    it('should schedule query when sortKey changes', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.sortKey = 'creationTime';
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('sortOrder property', () => {
    it('should update sortOrder value', () => {
      const service = new ListService();
      service.sortOrder = 'desc';
      expect(service.sortOrder).toBe('desc');
    });

    it('should schedule query when sortOrder changes', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.sortOrder = 'asc';
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('query getter', () => {
    it('should return correct query with defaults', () => {
      const service = new ListService();
      expect(service.query).toEqual({
        filter: undefined,
        maxResultCount: 10,
        skipCount: 0,
        sorting: undefined,
      });
    });

    it('should return correct query with filter', () => {
      const service = new ListService();
      service.filter = 'test';
      expect(service.query.filter).toBe('test');
    });

    it('should return undefined filter when empty', () => {
      const service = new ListService();
      service.filter = '';
      expect(service.query.filter).toBeUndefined();
    });

    it('should calculate skipCount based on page and maxResultCount', () => {
      const service = new ListService();
      service.page = 2;
      service.maxResultCount = 15;
      expect(service.query.skipCount).toBe(30);
    });

    it('should return sorting with only sortKey', () => {
      const service = new ListService();
      service.sortKey = 'name';
      expect(service.query.sorting).toBe('name');
    });

    it('should return sorting with sortKey and sortOrder', () => {
      const service = new ListService();
      service.sortKey = 'name';
      service.sortOrder = 'desc';
      expect(service.query.sorting).toBe('name desc');
    });

    it('should return undefined sorting when sortKey is empty', () => {
      const service = new ListService();
      service.sortOrder = 'desc';
      expect(service.query.sorting).toBeUndefined();
    });
  });

  describe('hookToQuery', () => {
    it('should call callback immediately with initial query', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [1, 2, 3], totalCount: 3 });

      const result = await service.hookToQuery(callback);

      expect(callback).toHaveBeenCalledWith({
        filter: undefined,
        maxResultCount: 10,
        skipCount: 0,
        sorting: undefined,
      });
      expect(result).toEqual({ items: [1, 2, 3], totalCount: 3 });
    });

    it('should set isLoading to true during query', async () => {
      const service = new ListService();
      let loadingDuringCall = false;

      const callback = vi.fn().mockImplementation(async () => {
        loadingDuringCall = service.isLoading;
        return { items: [], totalCount: 0 };
      });

      await service.hookToQuery(callback);

      expect(loadingDuringCall).toBe(true);
      expect(service.isLoading).toBe(false);
    });

    it('should set isLoading to false after query completes', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });

      await service.hookToQuery(callback);

      expect(service.isLoading).toBe(false);
    });

    it('should set isLoading to false even if query throws', async () => {
      const service = new ListService();
      const callback = vi.fn().mockRejectedValue(new Error('Test error'));

      await expect(service.hookToQuery(callback)).rejects.toThrow('Test error');
      expect(service.isLoading).toBe(false);
    });
  });

  describe('get method', () => {
    it('should trigger immediate query bypass debounce', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.get();

      expect(callback).toHaveBeenCalled();
    });

    it('should do nothing if no callback is set', () => {
      const service = new ListService();
      expect(() => service.get()).not.toThrow();
    });
  });

  describe('debouncing', () => {
    it('should debounce multiple property changes', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.filter = 'a';
      service.filter = 'ab';
      service.filter = 'abc';

      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should use custom delay when provided', async () => {
      const service = new ListService(500);
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.filter = 'test';

      vi.advanceTimersByTime(300);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(callback).toHaveBeenCalled();
    });

    it('should reset debounce timer on each change', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.filter = 'a';
      vi.advanceTimersByTime(200);

      service.filter = 'ab';
      vi.advanceTimersByTime(200);

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    it('should prevent scheduled queries from executing', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.filter = 'test';
      service.destroy();

      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should prevent get from executing callback', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.destroy();
      service.get();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should be an alias for destroy', async () => {
      const service = new ListService();
      const callback = vi.fn().mockResolvedValue({ items: [], totalCount: 0 });
      await service.hookToQuery(callback);
      callback.mockClear();

      service.filter = 'test';
      service.ngOnDestroy();

      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('loading state during scheduled query', () => {
    it('should set isLoading during scheduled query callback', async () => {
      const service = new ListService();
      let loadingStates: boolean[] = [];

      const callback = vi.fn().mockImplementation(async () => {
        loadingStates.push(service.isLoading);
        return { items: [], totalCount: 0 };
      });

      await service.hookToQuery(callback);
      loadingStates = [];

      service.filter = 'test';
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);

      // Wait for async callback to complete
      await vi.runAllTimersAsync();

      expect(loadingStates).toContain(true);
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical pagination workflow', async () => {
      const service = new ListService();
      const queryCalls: any[] = [];
      const callback = vi.fn().mockImplementation(async (query) => {
        queryCalls.push({ ...query });
        return { items: [], totalCount: 100 };
      });

      await service.hookToQuery(callback);

      // Change page
      service.page = 1;
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);
      await vi.runAllTimersAsync();

      // Change page size
      service.maxResultCount = 25;
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);
      await vi.runAllTimersAsync();

      expect(queryCalls[0].skipCount).toBe(0);
      expect(queryCalls[1].skipCount).toBe(10);
      expect(queryCalls[2].skipCount).toBe(25);
      expect(queryCalls[2].maxResultCount).toBe(25);
    });

    it('should handle typical search workflow', async () => {
      const service = new ListService();
      const queryCalls: any[] = [];
      const callback = vi.fn().mockImplementation(async (query) => {
        queryCalls.push({ ...query });
        return { items: [], totalCount: 10 };
      });

      await service.hookToQuery(callback);

      // User types search
      service.filter = 'john';
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);
      await vi.runAllTimersAsync();

      expect(queryCalls[1].filter).toBe('john');
    });

    it('should handle sorting workflow', async () => {
      const service = new ListService();
      const queryCalls: any[] = [];
      const callback = vi.fn().mockImplementation(async (query) => {
        queryCalls.push({ ...query });
        return { items: [], totalCount: 10 };
      });

      await service.hookToQuery(callback);

      // Sort by name ascending
      service.sortKey = 'name';
      service.sortOrder = 'asc';
      vi.advanceTimersByTime(LIST_QUERY_DEBOUNCE_TIME + 100);
      await vi.runAllTimersAsync();

      // Note: due to debouncing, both changes should result in one query
      expect(queryCalls.length).toBe(2); // initial + debounced
      expect(queryCalls[1].sorting).toBe('name asc');
    });
  });
});

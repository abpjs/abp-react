/**
 * ListService - Query management service for list components
 * Translated from @abp/ng.core v3.0.0
 *
 * Provides reactive query management with debouncing for list components.
 *
 * @since 2.9.0
 * @updated 3.0.0 - Added generic QueryParamsType parameter
 */

import { ABP } from '../models/common';
import { PagedResultDto } from '../models/dtos';

/**
 * Default debounce time for query changes in milliseconds
 */
export const LIST_QUERY_DEBOUNCE_TIME = 300;

/**
 * Callback type for creating query streams
 * @since 3.0.0 - Added generic QueryParamsType parameter
 */
export type QueryStreamCreatorCallback<T, QueryParamsType = ABP.PageQueryParams> = (
  query: QueryParamsType
) => Promise<PagedResultDto<T>>;

/**
 * Service for managing list queries with debouncing and loading state
 * @since 2.9.0
 * @updated 3.0.0 - Added generic QueryParamsType parameter
 */
export class ListService<QueryParamsType = ABP.PageQueryParams> {
  private _filter: string = '';
  private _maxResultCount: number = 10;
  private _page: number = 0;
  private _sortKey: string = '';
  private _sortOrder: string = '';
  private _isLoading: boolean = false;
  private _queryTimeout: ReturnType<typeof setTimeout> | null = null;
  private _queryCallback: (() => void) | null = null;
  private _disposed: boolean = false;

  /**
   * Creates a new ListService instance
   * @param delay - Debounce delay in milliseconds (default: LIST_QUERY_DEBOUNCE_TIME)
   */
  constructor(private delay: number = LIST_QUERY_DEBOUNCE_TIME) {}

  // Filter property with getter/setter
  get filter(): string {
    return this._filter;
  }

  set filter(value: string) {
    if (this._filter !== value) {
      this._filter = value;
      this.scheduleQuery();
    }
  }

  // MaxResultCount property with getter/setter
  get maxResultCount(): number {
    return this._maxResultCount;
  }

  set maxResultCount(value: number) {
    if (this._maxResultCount !== value) {
      this._maxResultCount = value;
      this.scheduleQuery();
    }
  }

  // Page property with getter/setter
  get page(): number {
    return this._page;
  }

  set page(value: number) {
    if (this._page !== value) {
      this._page = value;
      this.scheduleQuery();
    }
  }

  // SortKey property with getter/setter
  get sortKey(): string {
    return this._sortKey;
  }

  set sortKey(value: string) {
    if (this._sortKey !== value) {
      this._sortKey = value;
      this.scheduleQuery();
    }
  }

  // SortOrder property with getter/setter
  get sortOrder(): string {
    return this._sortOrder;
  }

  set sortOrder(value: string) {
    if (this._sortOrder !== value) {
      this._sortOrder = value;
      this.scheduleQuery();
    }
  }

  /**
   * Get the current query parameters
   * Note: Returns ABP.PageQueryParams by default, but can be cast to QueryParamsType
   */
  get query(): QueryParamsType {
    const sorting = this._sortKey
      ? `${this._sortKey}${this._sortOrder ? ' ' + this._sortOrder : ''}`
      : undefined;

    return {
      filter: this._filter || undefined,
      maxResultCount: this._maxResultCount,
      skipCount: this._page * this._maxResultCount,
      sorting,
    } as QueryParamsType;
  }

  /**
   * Get the current loading state
   */
  get isLoading(): boolean {
    return this._isLoading;
  }

  /**
   * Trigger an immediate query (bypassing debounce)
   */
  get = (): void => {
    if (this._queryCallback) {
      this._queryCallback();
    }
  };

  /**
   * Schedule a query with debouncing
   */
  private scheduleQuery(): void {
    if (this._queryTimeout) {
      clearTimeout(this._queryTimeout);
    }

    this._queryTimeout = setTimeout(() => {
      if (!this._disposed && this._queryCallback) {
        this._queryCallback();
      }
    }, this.delay);
  }

  /**
   * Hook to query - connects a data fetching callback to this service
   * @param streamCreatorCallback - Callback that fetches data based on query params
   * @returns Promise that resolves with the result of the callback
   */
  async hookToQuery<T>(
    streamCreatorCallback: QueryStreamCreatorCallback<T, QueryParamsType>
  ): Promise<PagedResultDto<T>> {
    // Set up the query callback
    this._queryCallback = async () => {
      if (this._disposed) return;

      this._isLoading = true;
      try {
        await streamCreatorCallback(this.query);
      } finally {
        if (!this._disposed) {
          this._isLoading = false;
        }
      }
    };

    // Perform initial query
    this._isLoading = true;
    try {
      return await streamCreatorCallback(this.query);
    } finally {
      this._isLoading = false;
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this._disposed = true;
    if (this._queryTimeout) {
      clearTimeout(this._queryTimeout);
      this._queryTimeout = null;
    }
    this._queryCallback = null;
  }

  /**
   * Alias for destroy - for compatibility with Angular OnDestroy pattern
   */
  ngOnDestroy(): void {
    this.destroy();
  }
}

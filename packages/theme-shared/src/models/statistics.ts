/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Statistics models for theme-shared
 * Translated from @abp/ng.theme.shared v0.9.0
 */

export namespace Statistics {
  /**
   * Response from statistics API
   */
  export interface Response {
    data: Data;
  }

  /**
   * Statistics data - key-value pairs of metric names and values
   */
  export interface Data {
    [key: string]: number;
  }

  /**
   * Filter for statistics queries
   */
  export interface Filter {
    startDate: string | Date;
    endDate: string | Date;
  }
}

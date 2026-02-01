/**
 * Cross-Origin Strategy for CORS configuration on elements
 * Translated from @abp/ng.core v2.4.0
 *
 * @since 2.4.0
 */

/**
 * Strategy for setting cross-origin attributes on elements
 */
export class CrossOriginStrategy {
  crossorigin: 'anonymous' | 'use-credentials';
  integrity?: string;

  constructor(crossorigin: 'anonymous' | 'use-credentials', integrity?: string) {
    this.crossorigin = crossorigin;
    this.integrity = integrity;
  }

  setCrossOrigin<T extends HTMLElement>(element: T): void {
    element.setAttribute('crossorigin', this.crossorigin);
    if (this.integrity) {
      element.setAttribute('integrity', this.integrity);
    }
  }
}

/**
 * Pre-configured cross-origin strategies
 */
export const CROSS_ORIGIN_STRATEGY = {
  /**
   * Anonymous cross-origin with optional integrity
   */
  Anonymous(integrity?: string): CrossOriginStrategy {
    return new CrossOriginStrategy('anonymous', integrity);
  },

  /**
   * Use credentials cross-origin with optional integrity
   */
  UseCredentials(integrity?: string): CrossOriginStrategy {
    return new CrossOriginStrategy('use-credentials', integrity);
  },
};

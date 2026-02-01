/**
 * Content Security Strategy for CSP nonce handling
 * Translated from @abp/ng.core v2.4.0
 *
 * @since 2.4.0
 */

/**
 * Abstract strategy for applying Content Security Policy to elements
 */
export abstract class ContentSecurityStrategy {
  nonce?: string;

  constructor(nonce?: string) {
    this.nonce = nonce;
  }

  abstract applyCSP(element: HTMLScriptElement | HTMLStyleElement): void;
}

/**
 * Loose CSP strategy that applies a nonce attribute
 */
export class LooseContentSecurityStrategy extends ContentSecurityStrategy {
  constructor(nonce: string) {
    super(nonce);
  }

  applyCSP(element: HTMLScriptElement | HTMLStyleElement): void {
    if (this.nonce) {
      element.setAttribute('nonce', this.nonce);
    }
  }
}

/**
 * No-op CSP strategy (no CSP applied)
 */
export class NoContentSecurityStrategy extends ContentSecurityStrategy {
  constructor() {
    super();
  }

  applyCSP(_: HTMLScriptElement | HTMLStyleElement): void {
    // No CSP applied
  }
}

/**
 * Pre-configured content security strategies
 */
export const CONTENT_SECURITY_STRATEGY = {
  /**
   * Loose CSP with nonce
   */
  Loose(nonce: string): LooseContentSecurityStrategy {
    return new LooseContentSecurityStrategy(nonce);
  },

  /**
   * No CSP applied
   */
  None(): NoContentSecurityStrategy {
    return new NoContentSecurityStrategy();
  },
};

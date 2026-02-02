/**
 * Content Strategy for inserting inline scripts and styles
 * Translated from @abp/ng.core v2.7.0
 *
 * @since 2.4.0
 * @updated 2.7.0 - insertElement() now returns the inserted element
 */

import {
  ContentSecurityStrategy,
  NoContentSecurityStrategy,
  CONTENT_SECURITY_STRATEGY,
} from './content-security.strategy';
import { DomStrategy, DOM_STRATEGY } from './dom.strategy';

/**
 * Abstract strategy for creating and inserting content elements
 */
export abstract class ContentStrategy<T extends HTMLScriptElement | HTMLStyleElement = any> {
  content: string;
  protected domStrategy: DomStrategy;
  protected contentSecurityStrategy: ContentSecurityStrategy;

  constructor(
    content: string,
    domStrategy: DomStrategy = DOM_STRATEGY.AppendToHead(),
    contentSecurityStrategy: ContentSecurityStrategy = CONTENT_SECURITY_STRATEGY.None()
  ) {
    this.content = content;
    this.domStrategy = domStrategy;
    this.contentSecurityStrategy = contentSecurityStrategy;
  }

  abstract createElement(): T;

  /**
   * Create and insert the element into the DOM
   * @returns The inserted element
   * @since 2.7.0 - Now returns the inserted element
   */
  insertElement(): T {
    const element = this.createElement();
    this.contentSecurityStrategy.applyCSP(element);
    this.domStrategy.insertElement(element);
    return element;
  }
}

/**
 * Strategy for inserting inline styles
 */
export class StyleContentStrategy extends ContentStrategy<HTMLStyleElement> {
  createElement(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = this.content;
    return style;
  }
}

/**
 * Strategy for inserting inline scripts
 */
export class ScriptContentStrategy extends ContentStrategy<HTMLScriptElement> {
  createElement(): HTMLScriptElement {
    const script = document.createElement('script');
    script.textContent = this.content;
    return script;
  }
}

/**
 * Pre-configured content strategies for common use cases
 */
export const CONTENT_STRATEGY = {
  /**
   * Append inline script to body
   */
  AppendScriptToBody(content: string): ScriptContentStrategy {
    return new ScriptContentStrategy(content, DOM_STRATEGY.AppendToBody());
  },

  /**
   * Append inline script to head
   */
  AppendScriptToHead(content: string): ScriptContentStrategy {
    return new ScriptContentStrategy(content, DOM_STRATEGY.AppendToHead());
  },

  /**
   * Append inline style to head
   */
  AppendStyleToHead(content: string): StyleContentStrategy {
    return new StyleContentStrategy(content, DOM_STRATEGY.AppendToHead());
  },

  /**
   * Prepend inline style to head
   */
  PrependStyleToHead(content: string): StyleContentStrategy {
    return new StyleContentStrategy(content, DOM_STRATEGY.PrependToHead());
  },
};

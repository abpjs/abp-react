/**
 * Loading Strategy for loading external scripts and styles
 * Translated from @abp/ng.core v2.4.0
 *
 * @since 2.4.0
 */

import { CrossOriginStrategy, CROSS_ORIGIN_STRATEGY } from './cross-origin.strategy';
import { DomStrategy, DOM_STRATEGY } from './dom.strategy';

/**
 * Abstract strategy for loading external resources
 */
export abstract class LoadingStrategy<T extends HTMLScriptElement | HTMLLinkElement = any> {
  path: string;
  protected domStrategy: DomStrategy;
  protected crossOriginStrategy?: CrossOriginStrategy;

  constructor(
    path: string,
    domStrategy: DomStrategy = DOM_STRATEGY.AppendToHead(),
    crossOriginStrategy?: CrossOriginStrategy
  ) {
    this.path = path;
    this.domStrategy = domStrategy;
    this.crossOriginStrategy = crossOriginStrategy;
  }

  abstract createElement(): T;

  /**
   * Create a promise stream for loading the element
   * Returns a promise that resolves on load and rejects on error
   */
  createStream<E extends Event>(): Promise<E> {
    return new Promise((resolve, reject) => {
      const element = this.createElement();

      if (this.crossOriginStrategy) {
        this.crossOriginStrategy.setCrossOrigin(element);
      }

      element.onload = (event) => resolve(event as E);
      element.onerror = (event) => reject(event);

      this.domStrategy.insertElement(element);
    });
  }
}

/**
 * Strategy for loading external scripts
 */
export class ScriptLoadingStrategy extends LoadingStrategy<HTMLScriptElement> {
  constructor(
    src: string,
    domStrategy: DomStrategy = DOM_STRATEGY.AppendToHead(),
    crossOriginStrategy?: CrossOriginStrategy
  ) {
    super(src, domStrategy, crossOriginStrategy);
  }

  createElement(): HTMLScriptElement {
    const script = document.createElement('script');
    script.src = this.path;
    script.type = 'text/javascript';
    return script;
  }
}

/**
 * Strategy for loading external stylesheets
 */
export class StyleLoadingStrategy extends LoadingStrategy<HTMLLinkElement> {
  constructor(
    href: string,
    domStrategy: DomStrategy = DOM_STRATEGY.AppendToHead(),
    crossOriginStrategy?: CrossOriginStrategy
  ) {
    super(href, domStrategy, crossOriginStrategy);
  }

  createElement(): HTMLLinkElement {
    const link = document.createElement('link');
    link.href = this.path;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    return link;
  }
}

/**
 * Pre-configured loading strategies for common use cases
 */
export const LOADING_STRATEGY = {
  /**
   * Append anonymous script to body
   */
  AppendAnonymousScriptToBody(src: string, integrity?: string): ScriptLoadingStrategy {
    return new ScriptLoadingStrategy(
      src,
      DOM_STRATEGY.AppendToBody(),
      CROSS_ORIGIN_STRATEGY.Anonymous(integrity)
    );
  },

  /**
   * Append anonymous script to head
   */
  AppendAnonymousScriptToHead(src: string, integrity?: string): ScriptLoadingStrategy {
    return new ScriptLoadingStrategy(
      src,
      DOM_STRATEGY.AppendToHead(),
      CROSS_ORIGIN_STRATEGY.Anonymous(integrity)
    );
  },

  /**
   * Append anonymous stylesheet to head
   */
  AppendAnonymousStyleToHead(src: string, integrity?: string): StyleLoadingStrategy {
    return new StyleLoadingStrategy(
      src,
      DOM_STRATEGY.AppendToHead(),
      CROSS_ORIGIN_STRATEGY.Anonymous(integrity)
    );
  },

  /**
   * Prepend anonymous script to head
   */
  PrependAnonymousScriptToHead(src: string, integrity?: string): ScriptLoadingStrategy {
    return new ScriptLoadingStrategy(
      src,
      DOM_STRATEGY.PrependToHead(),
      CROSS_ORIGIN_STRATEGY.Anonymous(integrity)
    );
  },

  /**
   * Prepend anonymous stylesheet to head
   */
  PrependAnonymousStyleToHead(src: string, integrity?: string): StyleLoadingStrategy {
    return new StyleLoadingStrategy(
      src,
      DOM_STRATEGY.PrependToHead(),
      CROSS_ORIGIN_STRATEGY.Anonymous(integrity)
    );
  },
};

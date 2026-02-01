/**
 * Lazy Load Utilities
 * Translated from @abp/ng.core v2.4.0
 *
 * @since 2.4.0
 */

import { CrossOriginStrategy } from '../strategies/cross-origin.strategy';
import { DomStrategy, DOM_STRATEGY } from '../strategies/dom.strategy';

/**
 * Create a promise for lazy loading a script or link element
 * @param element - The element to load (script or link)
 * @param domStrategy - Strategy for inserting the element into the DOM
 * @param crossOriginStrategy - Strategy for setting cross-origin attributes
 * @returns Promise that resolves when the element loads
 */
export function fromLazyLoad<T extends Event>(
  element: HTMLScriptElement | HTMLLinkElement,
  domStrategy: DomStrategy = DOM_STRATEGY.AppendToHead(),
  crossOriginStrategy?: CrossOriginStrategy
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (crossOriginStrategy) {
      crossOriginStrategy.setCrossOrigin(element);
    }

    element.onload = (event) => resolve(event as T);
    element.onerror = (event) => reject(event);

    domStrategy.insertElement(element);
  });
}

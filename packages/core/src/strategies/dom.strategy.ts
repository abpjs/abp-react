/**
 * DOM Strategy for element insertion
 * Translated from @abp/ng.core v2.4.0
 *
 * @since 2.4.0
 */

/**
 * Strategy for inserting elements into the DOM at specific positions
 */
export class DomStrategy {
  target: HTMLElement;
  position: InsertPosition;

  constructor(target: HTMLElement = document.head, position: InsertPosition = 'beforeend') {
    this.target = target;
    this.position = position;
  }

  insertElement<T extends HTMLElement>(element: T): void {
    this.target.insertAdjacentElement(this.position, element);
  }
}

/**
 * Pre-configured DOM strategies for common use cases
 */
export const DOM_STRATEGY = {
  /**
   * Insert element after a reference element
   */
  AfterElement(element: HTMLElement): DomStrategy {
    return new DomStrategy(element, 'afterend');
  },

  /**
   * Append element to body
   */
  AppendToBody(): DomStrategy {
    return new DomStrategy(document.body, 'beforeend');
  },

  /**
   * Append element to head
   */
  AppendToHead(): DomStrategy {
    return new DomStrategy(document.head, 'beforeend');
  },

  /**
   * Insert element before a reference element
   */
  BeforeElement(element: HTMLElement): DomStrategy {
    return new DomStrategy(element, 'beforebegin');
  },

  /**
   * Prepend element to head
   */
  PrependToHead(): DomStrategy {
    return new DomStrategy(document.head, 'afterbegin');
  },
};

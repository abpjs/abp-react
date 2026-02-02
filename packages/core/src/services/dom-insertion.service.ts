/**
 * DOM Insertion Service
 * Translated from @abp/ng.core v2.7.0
 *
 * Service for managing DOM insertions with tracking of inserted content.
 *
 * @since 2.4.0
 * @updated 2.7.0 - Made inserted private, added removeContent(), renamed hasInserted() to has()
 */

import { ContentStrategy } from '../strategies/content.strategy';

/**
 * Service for inserting content into the DOM with tracking
 */
export class DomInsertionService {
  /**
   * Set of already inserted content (tracked by content hash or reference)
   * @since 2.7.0 - Made private (was readonly)
   */
  private readonly inserted: Set<string> = new Set();

  /**
   * Insert content using a content strategy
   * Tracks insertions to prevent duplicates
   *
   * @param contentStrategy - The strategy defining how and what to insert
   * @returns The inserted element
   *
   * @since 2.7.0 - Now returns the inserted element
   */
  insertContent<T extends HTMLScriptElement | HTMLStyleElement>(
    contentStrategy: ContentStrategy<T>
  ): T {
    // Use content as the key to prevent duplicate insertions
    if (this.inserted.has(contentStrategy.content)) {
      return contentStrategy.createElement();
    }

    const element = contentStrategy.insertElement();
    this.inserted.add(contentStrategy.content);
    return element;
  }

  /**
   * Remove an element from the DOM and the tracking set
   *
   * @param element - The element to remove
   * @since 2.7.0
   */
  removeContent(element: HTMLScriptElement | HTMLStyleElement): void {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
    // Note: We can't easily remove from inserted set without tracking element->content mapping
    // This is consistent with the Angular implementation which also doesn't remove from the set
  }

  /**
   * Check if content has already been inserted
   *
   * @param content - The content to check
   * @returns true if the content has been inserted
   *
   * @since 2.7.0 - Renamed from hasInserted()
   */
  has(content: string): boolean {
    return this.inserted.has(content);
  }

  /**
   * Check if content has already been inserted
   *
   * @param content - The content to check
   * @returns true if the content has been inserted
   *
   * @deprecated Use has() instead
   */
  hasInserted(content: string): boolean {
    return this.has(content);
  }

  /**
   * Clear the tracking set (useful for testing)
   */
  clear(): void {
    this.inserted.clear();
  }
}

/**
 * Singleton instance of DomInsertionService
 */
let domInsertionServiceInstance: DomInsertionService | null = null;

/**
 * Get the singleton instance of DomInsertionService
 */
export function getDomInsertionService(): DomInsertionService {
  if (!domInsertionServiceInstance) {
    domInsertionServiceInstance = new DomInsertionService();
  }
  return domInsertionServiceInstance;
}

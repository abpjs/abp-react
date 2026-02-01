/**
 * DOM Insertion Service
 * Translated from @abp/ng.core v2.4.0
 *
 * Service for managing DOM insertions with tracking of inserted content.
 *
 * @since 2.4.0
 */

import { ContentStrategy } from '../strategies/content.strategy';

/**
 * Service for inserting content into the DOM with tracking
 */
export class DomInsertionService {
  /**
   * Set of already inserted content (tracked by content hash or reference)
   */
  readonly inserted: Set<unknown> = new Set();

  /**
   * Insert content using a content strategy
   * Tracks insertions to prevent duplicates
   *
   * @param contentStrategy - The strategy defining how and what to insert
   */
  insertContent(contentStrategy: ContentStrategy): void {
    // Use content as the key to prevent duplicate insertions
    if (this.inserted.has(contentStrategy.content)) {
      return;
    }

    contentStrategy.insertElement();
    this.inserted.add(contentStrategy.content);
  }

  /**
   * Check if content has already been inserted
   *
   * @param content - The content to check
   * @returns true if the content has been inserted
   */
  hasInserted(content: string): boolean {
    return this.inserted.has(content);
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

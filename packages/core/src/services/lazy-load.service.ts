import { uuid } from '../utils';
import { LoadingStrategy } from '../strategies/loading.strategy';

type LoadedLibraries = Record<string, Promise<void> | undefined>;

export class LazyLoadService {
  /**
   * Map of loaded resources (tracked by path to element)
   * Changed from Set<unknown> to Map in v2.9.0
   * @since 2.4.0
   * @updated 2.9.0
   */
  readonly loaded: Map<string, HTMLScriptElement | HTMLLinkElement> = new Map();

  private loadedLibraries: LoadedLibraries = {};

  /**
   * Load a single URL
   * @internal
   */
  private loadSingle(
    url: string | null,
    type: 'script' | 'style',
    content: string = '',
    targetQuery: string = 'body',
    position: InsertPosition = 'afterend'
  ): Promise<void> | undefined {
    if (!url && !content) return undefined;

    const key = url ? url.slice(url.lastIndexOf('/') + 1) : uuid();

    if (this.loadedLibraries[key]) {
      return this.loadedLibraries[key];
    }

    this.loadedLibraries[key] = new Promise<void>((resolve, reject) => {
      let library: HTMLElement;

      if (type === 'script') {
        library = document.createElement('script');
        (library as HTMLScriptElement).type = 'text/javascript';
        if (url) {
          (library as HTMLScriptElement).src = url;
        }
        (library as HTMLScriptElement).text = content;
      } else if (url) {
        library = document.createElement('link');
        (library as HTMLLinkElement).type = 'text/css';
        (library as HTMLLinkElement).rel = 'stylesheet';
        (library as HTMLLinkElement).href = url;
      } else {
        library = document.createElement('style');
        (library as HTMLStyleElement).textContent = content;
      }

      library.onload = () => resolve();
      library.onerror = () => reject(new Error(`Failed to load ${url || 'inline content'}`));

      const target = document.querySelector(targetQuery);
      if (target) {
        target.insertAdjacentElement(position, library);
      } else {
        document.body.appendChild(library);
      }
    });

    return this.loadedLibraries[key];
  }

  /**
   * Load a resource using a LoadingStrategy
   * @param strategy - The loading strategy to use
   * @param retryTimes - Number of retry attempts (default: 2)
   * @param retryDelay - Delay between retries in ms (default: 1000)
   * @since 2.4.0
   */
  load(strategy: LoadingStrategy, retryTimes?: number, retryDelay?: number): Promise<Event>;

  /**
   * Load one or more URLs
   * @param urlOrUrls - Single URL string, array of URLs, or null for inline content
   * @param type - Type of resource to load ('script' or 'style')
   * @param content - Inline content (for inline scripts/styles)
   * @param targetQuery - Query selector for the target element
   * @param position - Position relative to target element
   * @deprecated Use other overload that requires a strategy as first param
   * @since 1.0.0 - Now accepts string[] for urlOrUrls parameter
   */
  load(
    urlOrUrls: string | string[] | null,
    type: 'script' | 'style',
    content?: string,
    targetQuery?: string,
    position?: InsertPosition
  ): Promise<void> | undefined;

  load(
    strategyOrUrls: LoadingStrategy | string | string[] | null,
    typeOrRetryTimes?: 'script' | 'style' | number,
    contentOrRetryDelay?: string | number,
    targetQuery: string = 'body',
    position: InsertPosition = 'afterend'
  ): Promise<Event> | Promise<void> | undefined {
    // New strategy-based overload
    if (strategyOrUrls instanceof LoadingStrategy) {
      const strategy = strategyOrUrls;
      const retryTimes = (typeOrRetryTimes as number) ?? 2;
      const retryDelay = (contentOrRetryDelay as number) ?? 1000;

      // Check if already loaded
      if (this.loaded.has(strategy.path)) {
        return Promise.resolve(new Event('load'));
      }

      return this.loadWithRetry(strategy, retryTimes, retryDelay);
    }

    // Legacy overload
    const urlOrUrls = strategyOrUrls;
    const type = typeOrRetryTimes as 'script' | 'style';
    const content = (contentOrRetryDelay as string) ?? '';

    return this.loadLegacy(urlOrUrls, type, content, targetQuery, position);
  }

  /**
   * Load with retry logic
   * @internal
   */
  private async loadWithRetry(
    strategy: LoadingStrategy,
    retryTimes: number,
    retryDelay: number
  ): Promise<Event> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retryTimes; attempt++) {
      try {
        const event = await strategy.createStream<Event>();
        // Store element reference in map (v2.9.0)
        if (strategy.element) {
          this.loaded.set(strategy.path, strategy.element);
        }
        return event;
      } catch (error) {
        lastError = error;
        if (attempt < retryTimes) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Legacy load implementation
   * @internal
   */
  private loadLegacy(
    urlOrUrls: string | string[] | null,
    type: 'script' | 'style',
    content: string = '',
    targetQuery: string = 'body',
    position: InsertPosition = 'afterend'
  ): Promise<void> | undefined {
    // Handle array of URLs
    if (Array.isArray(urlOrUrls)) {
      const promises = urlOrUrls
        .map((url) => this.loadSingle(url, type, content, targetQuery, position))
        .filter((p): p is Promise<void> => p !== undefined);

      if (promises.length === 0) return undefined;

      return Promise.all(promises).then(() => undefined);
    }

    // Handle single URL or null
    return this.loadSingle(urlOrUrls, type, content, targetQuery, position);
  }

  /**
   * Check if a path has already been loaded
   * @since 2.4.0
   */
  isLoaded(path: string): boolean {
    return this.loaded.has(path) || path in this.loadedLibraries;
  }

  /**
   * Remove a loaded resource by path
   * @param path - The path/URL of the resource to remove
   * @returns true if the resource was found and removed, false otherwise
   * @since 2.9.0
   */
  remove(path: string): boolean {
    const element = this.loaded.get(path);
    if (element) {
      element.remove();
      this.loaded.delete(path);
      return true;
    }
    return false;
  }

  loadScript(
    url: string | string[],
    targetQuery?: string,
    position?: InsertPosition
  ): Promise<void> | undefined {
    return this.load(url, 'script', '', targetQuery, position);
  }

  loadStyle(
    url: string | string[],
    targetQuery?: string,
    position?: InsertPosition
  ): Promise<void> | undefined {
    return this.load(url, 'style', '', targetQuery, position);
  }

  loadInlineScript(
    content: string,
    targetQuery?: string,
    position?: InsertPosition
  ): Promise<void> | undefined {
    return this.load(null, 'script', content, targetQuery, position);
  }

  loadInlineStyle(
    content: string,
    targetQuery?: string,
    position?: InsertPosition
  ): Promise<void> | undefined {
    return this.load(null, 'style', content, targetQuery, position);
  }
}

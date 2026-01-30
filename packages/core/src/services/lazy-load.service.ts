import { uuid } from '../utils';

type LoadedLibraries = Record<string, Promise<void> | undefined>;

export class LazyLoadService {
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
   * Load one or more URLs
   * @param urlOrUrls - Single URL string, array of URLs, or null for inline content
   * @param type - Type of resource to load ('script' or 'style')
   * @param content - Inline content (for inline scripts/styles)
   * @param targetQuery - Query selector for the target element
   * @param position - Position relative to target element
   * @since 1.0.0 - Now accepts string[] for urlOrUrls parameter
   */
  load(
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

import { uuid } from '../utils';

type LoadedLibraries = Record<string, Promise<void> | undefined>;

export class LazyLoadService {
  private loadedLibraries: LoadedLibraries = {};

  load(
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

  loadScript(
    url: string,
    targetQuery?: string,
    position?: InsertPosition
  ): Promise<void> | undefined {
    return this.load(url, 'script', '', targetQuery, position);
  }

  loadStyle(
    url: string,
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

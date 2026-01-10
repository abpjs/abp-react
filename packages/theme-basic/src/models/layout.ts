import { ReactNode } from 'react';

/**
 * Layout namespace containing types and interfaces for the theme-basic layout system.
 * Translated from @abp/ng.theme.basic Layout namespace.
 */
export namespace Layout {
  /**
   * State interface for the layout store.
   * Contains navigation elements that can be added to the layout.
   */
  export interface State {
    navigationElements: NavigationElement[];
  }

  /**
   * Navigation element that can be added to the layout's right part.
   * In Angular, this used TemplateRef; in React, we use ReactNode.
   */
  export interface NavigationElement {
    /** Unique name identifier for the navigation element */
    name: string;
    /** React component/element to render */
    element: ReactNode;
    /** Order for sorting (lower values appear first, defaults to 99) */
    order?: number;
  }
}

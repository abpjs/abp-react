/* eslint-disable @typescript-eslint/no-namespace */
import { ComponentType } from 'react';

/**
 * ReplaceableComponents namespace for component replacement system
 * @since 2.0.0
 */
export namespace ReplaceableComponents {
  /**
   * State for managing replaceable components
   */
  export interface State {
    replaceableComponents: ReplaceableComponent[];
  }

  /**
   * A replaceable component definition
   */
  export interface ReplaceableComponent {
    /**
     * The React component to use as replacement
     */
    component: ComponentType<any>;
    /**
     * Unique key identifier for the component
     */
    key: string;
  }

  /**
   * Input configuration for replaceable template directive/hook
   */
  export interface ReplaceableTemplateDirectiveInput<I, O> {
    inputs: {
      [K in keyof I]: {
        value: I[K];
        twoWay?: boolean;
      };
    };
    outputs: {
      [K in keyof O]: (value: O[K]) => void;
    };
    componentKey: string;
  }

  /**
   * Data passed to replaceable template
   */
  export interface ReplaceableTemplateData<I, O> {
    inputs: ReplaceableTemplateInputs<I>;
    outputs: ReplaceableTemplateOutputs<O>;
    componentKey: string;
  }

  /**
   * Input type mapping
   */
  export type ReplaceableTemplateInputs<T> = {
    [K in keyof T]: T[K];
  };

  /**
   * Output type mapping
   */
  export type ReplaceableTemplateOutputs<T> = {
    [K in keyof T]: (value: T[K]) => void;
  };

  /**
   * Route data for replaceable route containers
   */
  export interface RouteData<T = any> {
    /**
     * Unique key for the replaceable component
     */
    key: string;
    /**
     * Default component to render if no replacement is registered
     */
    defaultComponent: ComponentType<T>;
  }
}

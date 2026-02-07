/**
 * Utility types for component and template type inference
 * Translated from @abp/ng.core v3.2.0
 *
 * Note: These are adapted for React patterns since Angular's Type<T> and TemplateRef<T>
 * don't have direct React equivalents. These types help with component factories and
 * render props patterns in React.
 *
 * @since 2.7.0
 * @updated 3.2.0 - Added DeepPartial type
 */

import { ComponentType, ReactElement } from 'react';

/**
 * Serializable type for DeepPartial - represents objects that can be serialized
 * @since 3.2.0
 */
type Serializable = Record<
  string | number | symbol,
  string | number | boolean | Record<string | number | symbol, unknown>
>;

/**
 * DeepPartial type - makes all properties optional recursively
 * Only applies partial to Serializable types (objects), not primitives
 * @since 3.2.0
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Serializable ? DeepPartial<T[P]> : T[P];
};

/**
 * Infer the props type from a React component type
 * Equivalent to Angular's InferredInstanceOf<Type<T>>
 */
export type InferredInstanceOf<T> = T extends ComponentType<infer P> ? P : never;

/**
 * Infer the context type from a render prop function
 * Equivalent to Angular's InferredContextOf<TemplateRef<T>>
 */
export type InferredContextOf<T> = T extends (context: infer C) => ReactElement ? C : never;

/**
 * Generic component factory type
 * @since 2.7.0
 */
export type ComponentFactory<P = unknown> = ComponentType<P> | ((props: P) => ReactElement);

/**
 * Render prop type for template-like patterns in React
 * @since 2.7.0
 */
export type RenderProp<C = unknown> = (context: C) => ReactElement;

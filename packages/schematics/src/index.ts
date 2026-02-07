/**
 * @abpjs/schematics
 * Translated from @abp/ng.schematics v4.0.0
 *
 * ABP Framework schematics types and utilities for React.
 * This package provides types, interfaces, utilities, EJS templates,
 * and CLI commands for proxy code generation.
 *
 * Features:
 * - Typed proxy service classes (RestService wrappers)
 * - React Query (TanStack Query) hook generation
 * - TypeScript interface and enum generation
 * - CLI commands: proxy-add, proxy-refresh, proxy-remove
 *
 * Changes in v4.0.0:
 * - Added isRequired field to PropertyDef interface
 *
 * Changes in v3.2.0:
 * - Updated PROXY_WARNING with important notice about npm module publishing
 * - Added code generation engine with EJS templates
 * - Added React Query hook generation
 * - Added CLI commands for proxy management
 */

export * from './constants';
export * from './enums';
export * from './models';
export * from './utils';
export * from './commands';

/**
 * @abpjs/components v3.1.0
 * ABP Framework shared components for React
 * Translated from @abp/ng.components v3.1.0
 *
 * This package provides reusable UI components for ABP applications.
 *
 * ## Tree Component
 *
 * The tree subpackage provides a hierarchical tree view component with:
 * - Expandable/collapsible nodes
 * - Checkable nodes
 * - Drag and drop support
 * - Context menus
 *
 * Import from '@abpjs/components/tree' for tree-specific exports.
 *
 * @example
 * ```tsx
 * import { Tree, TreeAdapter, BaseNode } from '@abpjs/components/tree';
 *
 * const adapter = new TreeAdapter(flatList);
 * return <Tree nodes={adapter.getTree()} />;
 * ```
 */

// Re-export tree module for convenience
export * from './tree';

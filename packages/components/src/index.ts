/**
 * @abpjs/components v4.0.0
 * ABP Framework shared components for React
 * Translated from @abp/ng.components v4.0.0
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
 * - Custom node templates (v3.2.0)
 * - Custom expanded icon templates (v3.2.0)
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
 *
 * ## Changelog
 *
 * ### v4.0.0
 * - Dependency update: @abp/ng.core peer dependency bumped to >=4.0.0
 * - No source code changes in Angular package (version bump only)
 *
 * ### v3.2.0
 * - Tree: Added `customNodeTemplate` prop for custom node rendering
 * - Tree: Added `expandedIconTemplate` prop for custom expand/collapse icons
 * - Tree: Added `TreeNodeTemplateContext` and `ExpandedIconTemplateContext` types
 * - TreeAdapter: Added `handleUpdate({ key, children })` method
 * - TreeAdapter: Added `updateTreeFromList(list)` method
 * - TreeAdapter: `handleDrop` and `handleRemove` now use destructured parameters
 */

// Re-export tree module for convenience
export * from './tree';

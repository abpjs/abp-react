/**
 * Routes Service
 * Translated from @abp/ng.core v3.0.0
 *
 * Provides tree-based route management as a replacement for ConfigState route handling.
 *
 * @since 3.0.0
 */

import { ABP } from '../models/common';
import {
  TreeNode,
  createTreeFromList,
  findInTree,
  flattenTree,
  sortTree,
} from '../utils/tree-utils';

/**
 * Abstract base class for tree-based services
 * @since 3.0.0
 */
export abstract class AbstractTreeService<T extends object> {
  abstract readonly id: string;
  abstract readonly parentId: string;
  abstract readonly hide: (item: T) => boolean;
  abstract readonly sort: (a: T, b: T) => number;

  private _flat: T[] = [];
  private _tree: TreeNode<T>[] = [];
  private _visible: TreeNode<T>[] = [];
  private _listeners: Set<() => void> = new Set();

  /**
   * Get the flat list of items
   */
  get flat(): T[] {
    return this._flat;
  }

  /**
   * Get the tree structure
   */
  get tree(): TreeNode<T>[] {
    return this._tree;
  }

  /**
   * Get visible tree nodes (filtered by hide predicate)
   */
  get visible(): TreeNode<T>[] {
    return this._visible;
  }

  /**
   * Subscribe to changes
   */
  subscribe(listener: () => void): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of changes
   */
  protected notify(): void {
    this._listeners.forEach((listener) => listener());
  }

  /**
   * Create tree from flat list
   */
  protected createTree(items: T[]): TreeNode<T>[] {
    const tree = createTreeFromList<T, T>(
      items,
      (item) => (item as any)[this.id],
      (item) => (item as any)[this.parentId],
      (item) => item
    );

    // Sort the tree
    return sortTree(tree, (a, b) => this.sort(a as T, b as T));
  }

  /**
   * Filter tree by hide predicate
   */
  private filterVisible(nodes: TreeNode<T>[]): TreeNode<T>[] {
    return nodes
      .filter((node) => !this.hide(node as T))
      .map((node) => ({
        ...node,
        children: this.filterVisible(node.children),
      }));
  }

  /**
   * Publish changes to tree
   */
  protected publish(): void {
    this._tree = this.createTree(this._flat);
    this._visible = this.filterVisible(this._tree);
    this.notify();
  }

  /**
   * Add items to the service
   * @param items - Items to add
   * @returns Updated flat list
   */
  add(items: T[]): T[] {
    this._flat = [...this._flat, ...items];
    this.publish();
    return this._flat;
  }

  /**
   * Find a node by predicate
   * @param predicate - Function to test each node
   * @param tree - Optional tree to search (defaults to this.tree)
   * @returns The found node or null
   */
  find(
    predicate: (item: TreeNode<T>) => boolean,
    tree: TreeNode<T>[] = this._tree
  ): TreeNode<T> | null {
    return findInTree(tree, predicate);
  }

  /**
   * Patch an item by identifier
   * @param identifier - The identifier value to match
   * @param props - Properties to merge
   * @returns Updated flat list or false if not found
   */
  patch(identifier: string, props: Partial<T>): T[] | false {
    const index = this._flat.findIndex(
      (item) => (item as any)[this.id] === identifier
    );

    if (index === -1) {
      return false;
    }

    this._flat = [
      ...this._flat.slice(0, index),
      { ...this._flat[index], ...props },
      ...this._flat.slice(index + 1),
    ];

    this.publish();
    return this._flat;
  }

  /**
   * Refresh the tree structure
   * @returns Updated flat list
   */
  refresh(): T[] {
    this.publish();
    return this._flat;
  }

  /**
   * Remove items by identifiers
   * @param identifiers - Array of identifier values to remove
   * @returns Updated flat list
   */
  remove(identifiers: string[]): T[] {
    const identifierSet = new Set(identifiers);
    this._flat = this._flat.filter(
      (item) => !identifierSet.has((item as any)[this.id])
    );
    this.publish();
    return this._flat;
  }

  /**
   * Search for a node by partial properties
   * @param params - Partial properties to match
   * @param tree - Optional tree to search
   * @returns The found node or null
   */
  search(params: Partial<T>, tree: TreeNode<T>[] = this._tree): TreeNode<T> | null {
    const keys = Object.keys(params) as (keyof T)[];
    return this.find(
      (node) => keys.every((key) => node[key] === params[key]),
      tree
    );
  }
}

/**
 * Abstract navigation tree service for Nav-based items
 * @since 3.0.0
 */
export abstract class AbstractNavTreeService<
  T extends ABP.Nav
> extends AbstractTreeService<T> {
  readonly id = 'name' as const;
  readonly parentId = 'parentName' as const;

  readonly hide = (item: T): boolean => {
    return item.invisible === true || !this.isGranted(item);
  };

  readonly sort = (a: T, b: T): number => {
    return (a.order ?? 0) - (b.order ?? 0);
  };

  private _grantedPolicies: Record<string, boolean> = {};

  /**
   * Set granted policies for permission checking
   */
  setGrantedPolicies(policies: Record<string, boolean>): void {
    this._grantedPolicies = policies;
    this.publish();
  }

  /**
   * Check if an item's required policy is granted
   */
  protected isGranted(item: T): boolean {
    const { requiredPolicy } = item;
    if (!requiredPolicy) {
      return true;
    }
    return this._grantedPolicies[requiredPolicy] ?? false;
  }

  /**
   * Check if a node has children
   * @param identifier - The name of the node
   */
  hasChildren(identifier: string): boolean {
    const node = this.find((n) => (n as any)[this.id] === identifier);
    return node ? node.children.length > 0 : false;
  }

  /**
   * Check if a node has any invisible children
   * @param identifier - The name of the node
   */
  hasInvisibleChild(identifier: string): boolean {
    const node = this.find((n) => (n as any)[this.id] === identifier);
    if (!node) return false;

    const flatChildren = flattenTree(node.children);
    return flatChildren.some((child) => this.hide(child as T));
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    // Cleanup if needed
  }
}

/**
 * Routes service for managing application routes
 * @since 3.0.0
 */
export class RoutesService extends AbstractNavTreeService<ABP.Route> {
  private static _instance: RoutesService | null = null;

  /**
   * Get singleton instance
   */
  static getInstance(): RoutesService {
    if (!RoutesService._instance) {
      RoutesService._instance = new RoutesService();
    }
    return RoutesService._instance;
  }

  /**
   * Reset the singleton instance (useful for testing)
   * @internal
   */
  static resetInstance(): void {
    RoutesService._instance = null;
  }
}

/**
 * Setting tabs service for managing setting page tabs
 * @since 3.0.0
 */
export class SettingTabsService extends AbstractNavTreeService<ABP.Tab> {
  private static _instance: SettingTabsService | null = null;

  /**
   * Get singleton instance
   */
  static getInstance(): SettingTabsService {
    if (!SettingTabsService._instance) {
      SettingTabsService._instance = new SettingTabsService();
    }
    return SettingTabsService._instance;
  }

  /**
   * Reset the singleton instance (useful for testing)
   * @internal
   */
  static resetInstance(): void {
    SettingTabsService._instance = null;
  }
}

/**
 * Get the routes service singleton
 * @since 3.0.0
 */
export function getRoutesService(): RoutesService {
  return RoutesService.getInstance();
}

/**
 * Get the setting tabs service singleton
 * @since 3.0.0
 */
export function getSettingTabsService(): SettingTabsService {
  return SettingTabsService.getInstance();
}

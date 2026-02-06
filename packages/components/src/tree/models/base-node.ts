/**
 * Base interface for tree nodes
 * Nodes must have an id and optional parentId
 * The name/displayName is used to generate the node title
 */
export interface BaseNode {
  /** Unique identifier for the node */
  id: string;
  /** Parent node's id, null for root nodes */
  parentId: string | null;
  /** Optional name for the node */
  name?: string;
  /** Optional display name for the node (takes precedence over name) */
  displayName?: string;
}

/**
 * Name resolver function type
 * Used to extract the display title from an entity
 */
export type NameResolver<T extends BaseNode> = (entity: T) => string;

/**
 * Default name resolver that returns displayName or name
 */
export const defaultNameResolver: NameResolver<BaseNode> = (entity) =>
  entity.displayName || entity.name || '';

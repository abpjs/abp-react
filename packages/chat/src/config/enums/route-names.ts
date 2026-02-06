/**
 * Route name keys for the Chat module.
 * These keys are used for route localization and identification.
 * @since 3.0.0 - Moved to config subpackage
 */
export const eChatRouteNames = {
  /**
   * Chat route name key.
   * Used for the main chat route.
   */
  Chat: 'Chat',
} as const;

/**
 * Type for chat route name key values
 */
export type ChatRouteNameKey =
  (typeof eChatRouteNames)[keyof typeof eChatRouteNames];

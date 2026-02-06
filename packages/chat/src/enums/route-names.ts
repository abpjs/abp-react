/**
 * Route name keys for the Chat module.
 * These keys are used for route localization and identification.
 * @since 2.9.0
 */
export const eChatRouteNames = {
  /**
   * Chat route name key.
   * Used for the main chat route.
   */
  Chat: 'AbpChat::Chat',
} as const;

/**
 * Type for chat route name key values
 */
export type ChatRouteNameKey =
  (typeof eChatRouteNames)[keyof typeof eChatRouteNames];

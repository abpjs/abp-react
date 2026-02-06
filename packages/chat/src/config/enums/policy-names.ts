/**
 * Policy names for the Chat module.
 * These policy names are used for permission checking.
 * @since 3.0.0
 */
export const eChatPolicyNames = {
  /**
   * Messaging policy for chat functionality.
   * Required to access chat features.
   */
  Messaging: 'Chat.Messaging',
} as const;

/**
 * Type for chat policy name key values
 */
export type ChatPolicyNameKey =
  (typeof eChatPolicyNames)[keyof typeof eChatPolicyNames];

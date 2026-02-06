/**
 * Component keys for the Chat module.
 * These keys are used for component replacement/customization.
 * @since 2.9.0
 */
export const eChatComponents = {
  /**
   * Key for the Chat component.
   * Use this to replace the default Chat with a custom implementation.
   */
  Chat: 'Chat.ChatComponent',
  /**
   * Key for the ChatContacts component.
   * Use this to replace the default ChatContacts with a custom implementation.
   */
  ChatContacts: 'Chat.ChatContactsComponent',
  /**
   * Key for the ConversationAvatar component.
   * Use this to replace the default ConversationAvatar with a custom implementation.
   */
  ConversationAvatar: 'Chat.ConversationAvatarComponent',
  /**
   * Key for the ChatIcon component.
   * Use this to replace the default ChatIcon with a custom implementation.
   */
  ChatIcon: 'Chat.ChatIconComponent',
} as const;

/**
 * Type for chat component key values
 */
export type ChatComponentKey =
  (typeof eChatComponents)[keyof typeof eChatComponents];

/**
 * Chat Message Side Enum
 * Indicates whether a message was sent or received
 * @volo/abp.ng.chat v2.9.0
 */
export enum ChatMessageSide {
  /** Message was sent by the current user */
  Sender = 1,
  /** Message was received from another user */
  Receiver = 2,
}

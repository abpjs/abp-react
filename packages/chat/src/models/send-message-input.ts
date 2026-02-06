/**
 * Send Message Input
 * Parameters for sending a chat message
 * @volo/abp.ng.chat v2.9.0
 */
export interface SendMessageInput {
  /** Target user ID to send message to */
  targetUserId: string;
  /** Message content */
  message: string;
}

/**
 * Creates a new SendMessageInput with optional initial values
 */
export function createSendMessageInput(
  initialValues?: Partial<SendMessageInput>
): SendMessageInput {
  return {
    targetUserId: '',
    message: '',
    ...initialValues,
  };
}

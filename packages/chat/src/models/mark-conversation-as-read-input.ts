/**
 * Mark Conversation As Read Input
 * Parameters for marking a conversation as read
 * @volo/abp.ng.chat v2.9.0
 */
export interface MarkConversationAsReadInput {
  /** Target user ID whose conversation to mark as read */
  targetUserId: string;
}

/**
 * Creates a new MarkConversationAsReadInput with optional initial values
 */
export function createMarkConversationAsReadInput(
  initialValues?: Partial<MarkConversationAsReadInput>
): MarkConversationAsReadInput {
  return {
    targetUserId: '',
    ...initialValues,
  };
}

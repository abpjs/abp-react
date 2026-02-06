/**
 * Get Conversation Input
 * Parameters for fetching a conversation with paging support
 * @volo/abp.ng.chat v2.9.0
 */
export interface GetConversationInput {
  /** Target user ID to get conversation with */
  targetUserId: string;
  /** Number of items to skip (pagination) */
  skipCount: number;
  /** Maximum number of items to return (pagination) */
  maxResultCount: number;
}

/**
 * Creates a new GetConversationInput with optional initial values
 */
export function createGetConversationInput(
  initialValues?: Partial<GetConversationInput>
): GetConversationInput {
  return {
    targetUserId: '',
    skipCount: 0,
    maxResultCount: 20,
    ...initialValues,
  };
}

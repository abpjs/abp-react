/**
 * Chat Target User Info
 * Contains basic user information for a chat target
 * @volo/abp.ng.chat v2.9.0
 */
export interface ChatTargetUserInfo {
  /** User ID */
  userId: string;
  /** First name */
  name: string;
  /** Last name/surname */
  surname: string;
  /** Username */
  username: string;
}

/**
 * Creates a new ChatTargetUserInfo with optional initial values
 */
export function createChatTargetUserInfo(
  initialValues?: Partial<ChatTargetUserInfo>
): ChatTargetUserInfo {
  return {
    userId: '',
    name: '',
    surname: '',
    username: '',
    ...initialValues,
  };
}

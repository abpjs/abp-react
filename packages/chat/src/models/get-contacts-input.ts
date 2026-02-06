/**
 * Get Contacts Input
 * Parameters for fetching chat contacts
 * @volo/abp.ng.chat v2.9.0
 */
export interface GetContactsInput {
  /** Filter string for searching contacts */
  filter?: string;
  /** Include contacts without previous messages */
  includeOtherContacts?: boolean;
}

/**
 * Creates a new GetContactsInput with optional initial values
 */
export function createGetContactsInput(
  initialValues?: Partial<GetContactsInput>
): GetContactsInput {
  return {
    filter: undefined,
    includeOtherContacts: undefined,
    ...initialValues,
  };
}

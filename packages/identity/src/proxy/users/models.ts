/**
 * User data models for user lookup
 * Translated from @abp/ng.identity v3.2.0
 * @since 3.2.0
 */

/**
 * User data returned from user lookup service
 * @since 3.2.0
 */
export interface UserData {
  id: string;
  tenantId?: string;
  userName: string;
  name: string;
  surname: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
}

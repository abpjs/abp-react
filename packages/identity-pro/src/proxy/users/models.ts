/**
 * User data models for user lookup
 * Translated from @volo/abp.ng.identity/lib/proxy/users/models
 * @since 3.2.0
 */

/**
 * User data returned from user lookup service
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

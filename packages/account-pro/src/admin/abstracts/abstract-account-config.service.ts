/**
 * Abstract Account Settings Service
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * Base class for admin account settings services (general, LDAP, 2FA, captcha, external providers).
 * Each concrete service provides a specific URL and settings type.
 *
 * Changes in v4.0.0:
 * - Added second generic type SubmitType (defaults to Type)
 * - updateSettings now takes Partial<SubmitType> instead of Type
 *
 * @since 3.2.0
 * @since 4.0.0 - Added SubmitType generic parameter
 */
import type { RestService } from '@abpjs/core';

export abstract class AbstractAccountSettingsService<Type, SubmitType = Type> {
  apiName = 'default';
  protected abstract url: string;

  constructor(protected restService: RestService) {}

  /**
   * Get the current settings
   */
  getSettings(): Promise<Type> {
    return this.restService.get<Type>(this.url);
  }

  /**
   * Update settings
   * @since 4.0.0 - Takes Partial<SubmitType> instead of Type
   */
  updateSettings(body: Partial<SubmitType>): Promise<SubmitType> {
    return this.restService.put<Partial<SubmitType>, SubmitType>(this.url, body);
  }
}

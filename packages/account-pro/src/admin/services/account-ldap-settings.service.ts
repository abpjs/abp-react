/**
 * Account LDAP Settings Service
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * @since 3.2.0
 */
import type { RestService } from '@abpjs/core';
import { AbstractAccountSettingsService } from '../abstracts/abstract-account-config.service';
import type { AccountLdapSettingsDto } from '../models/account-settings';

export class AccountLdapService extends AbstractAccountSettingsService<AccountLdapSettingsDto> {
  protected url = '/api/account-admin/settings/ldap';

  constructor(restService: RestService) {
    super(restService);
  }
}

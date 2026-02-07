/**
 * Account Two-Factor Settings Service
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * @since 3.2.0
 */
import type { RestService } from '@abpjs/core';
import { AbstractAccountSettingsService } from '../abstracts/abstract-account-config.service';
import type { AccountTwoFactorSettingsDto } from '../models/account-settings';

export class AccountTwoFactorSettingService extends AbstractAccountSettingsService<AccountTwoFactorSettingsDto> {
  protected url = '/api/account-admin/settings/two-factor';

  constructor(restService: RestService) {
    super(restService);
  }
}

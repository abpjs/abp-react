/**
 * Account External Provider Settings Service
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * @since 4.0.0
 */
import type { RestService } from '@abpjs/core';
import { AbstractAccountSettingsService } from '../abstracts/abstract-account-config.service';
import type { AccountExternalProviderSettings } from '../models/account-settings';

export class AccountExternalProviderService extends AbstractAccountSettingsService<AccountExternalProviderSettings> {
  protected url = '/api/account-admin/settings/external-provider';

  constructor(restService: RestService) {
    super(restService);
  }
}

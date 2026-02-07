/**
 * Account Settings Service (General)
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * @since 3.2.0
 */
import type { RestService } from '@abpjs/core';
import { AbstractAccountSettingsService } from '../abstracts/abstract-account-config.service';
import type { AccountSettingsDto } from '../models/account-settings';

export class AccountSettingsService extends AbstractAccountSettingsService<AccountSettingsDto> {
  protected url = '/api/account-admin/settings';

  constructor(restService: RestService) {
    super(restService);
  }
}

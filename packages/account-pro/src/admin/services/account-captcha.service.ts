/**
 * Account Captcha Settings Service
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * @since 4.0.0
 */
import type { RestService } from '@abpjs/core';
import { AbstractAccountSettingsService } from '../abstracts/abstract-account-config.service';
import type { AccountCaptchaSettings } from '../models/account-settings';

export class AccountCaptchaService extends AbstractAccountSettingsService<AccountCaptchaSettings> {
  protected url = '/api/account-admin/settings/captcha';

  constructor(restService: RestService) {
    super(restService);
  }
}

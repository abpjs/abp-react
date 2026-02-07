/**
 * Identity Settings Service
 * Translated from @volo/abp.ng.identity IdentitySettingsService
 * @since 3.2.0
 */
import type { RestService } from '@abpjs/core';
import type { IdentitySettingsDto } from './models';

/**
 * Service for managing identity settings
 * @since 3.2.0
 */
export class IdentitySettingsService {
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Gets identity settings
   */
  get(): Promise<IdentitySettingsDto> {
    return this.restService.request<unknown, IdentitySettingsDto>({
      method: 'GET',
      url: '/api/identity/settings',
    });
  }

  /**
   * Updates identity settings
   */
  update(input: IdentitySettingsDto): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: '/api/identity/settings',
      body: input,
    });
  }
}

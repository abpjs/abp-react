/**
 * Profile Service
 * Translated from @volo/abp.ng.identity ProfileService
 * @since 3.2.0
 */
import type { RestService } from '@abpjs/core';
import type { ChangePasswordInput, ProfileDto, UpdateProfileDto } from './models';

/**
 * Service for managing user profile
 * @since 3.2.0
 */
export class ProfileService {
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Changes the current user's password
   */
  changePassword(input: ChangePasswordInput): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'POST',
      url: '/api/identity/my-profile/change-password',
      body: input,
    });
  }

  /**
   * Gets the current user's profile
   */
  get(): Promise<ProfileDto> {
    return this.restService.request<unknown, ProfileDto>({
      method: 'GET',
      url: '/api/identity/my-profile',
    });
  }

  /**
   * Gets the current user's two-factor authentication status
   */
  getTwoFactorEnabled(): Promise<boolean> {
    return this.restService.request<unknown, boolean>({
      method: 'GET',
      url: '/api/identity/my-profile/two-factor-enabled',
    });
  }

  /**
   * Sets the current user's two-factor authentication status
   */
  setTwoFactorEnabled(enabled: boolean): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'POST',
      url: `/api/identity/my-profile/two-factor/${enabled}`,
    });
  }

  /**
   * Updates the current user's profile
   */
  update(input: UpdateProfileDto): Promise<ProfileDto> {
    return this.restService.request<unknown, ProfileDto>({
      method: 'PUT',
      url: '/api/identity/my-profile',
      body: input,
    });
  }
}

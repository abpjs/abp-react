import { RestService } from '@abpjs/core';
import type { ChangePasswordInput, ProfileDto, UpdateProfileDto } from './models';

/**
 * Profile proxy service for profile management API calls
 * Translated from @abp/ng.identity v3.2.0
 *
 * @since 3.2.0
 */
export class ProfileService {
  private restService: RestService;

  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(restService: RestService) {
    this.restService = restService;
  }

  /**
   * Change the current user's password
   * @param input - Current and new password
   * @returns Promise that resolves when password is changed
   */
  changePassword = (input: ChangePasswordInput): Promise<void> => {
    return this.restService.request<ChangePasswordInput, void>({
      method: 'POST',
      url: '/api/identity/my-profile/change-password',
      body: input,
    });
  };

  /**
   * Get the current user's profile
   * @returns Promise with the profile data
   */
  get = (): Promise<ProfileDto> => {
    return this.restService.request<void, ProfileDto>({
      method: 'GET',
      url: '/api/identity/my-profile',
    });
  };

  /**
   * Update the current user's profile
   * @param input - Updated profile data
   * @returns Promise with the updated profile
   */
  update = (input: UpdateProfileDto): Promise<ProfileDto> => {
    return this.restService.request<UpdateProfileDto, ProfileDto>({
      method: 'PUT',
      url: '/api/identity/my-profile',
      body: input,
    });
  };
}

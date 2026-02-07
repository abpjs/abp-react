import { RestService } from '@abpjs/core';
import type { ProfilePictureInput, ProfilePictureSourceDto } from '../models';

/**
 * ProfileService - Service for profile picture and two-factor authentication operations
 *
 * This is the React equivalent of Angular's ProfileService from @volo/abp.ng.account.
 * Provides methods for managing profile pictures and two-factor authentication settings.
 *
 * @since 3.2.0
 */
export class ProfileService {
  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(private rest: RestService) {}

  /**
   * Get the current user's profile picture source
   *
   * @returns Promise resolving to ProfilePictureSourceDto with picture type and source URL
   */
  getProfilePicture(): Promise<ProfilePictureSourceDto> {
    return this.rest.get<ProfilePictureSourceDto>(
      '/api/account/profile-picture'
    );
  }

  /**
   * Set the current user's profile picture
   *
   * @param input - The profile picture input with type and optional file bytes
   * @returns Promise resolving when the profile picture is set
   */
  setProfilePicture(input: ProfilePictureInput): Promise<void> {
    return this.rest.post<ProfilePictureInput, void>(
      '/api/account/profile-picture',
      input,
      { skipHandleError: true }
    );
  }

  /**
   * Get a user's profile picture by user ID
   *
   * @param userId - The ID of the user
   * @returns Promise resolving to ProfilePictureSourceDto with picture type and source URL
   */
  getProfilePictureByUserId(userId: string): Promise<ProfilePictureSourceDto> {
    return this.rest.get<ProfilePictureSourceDto>(
      `/api/account/profile-picture/${userId}`
    );
  }

  /**
   * Get whether two-factor authentication is enabled for the current user
   *
   * @returns Promise resolving to boolean indicating if 2FA is enabled
   */
  getTwoFactorEnabled(): Promise<boolean> {
    return this.rest.get<boolean>('/api/account/two-factor-enabled');
  }

  /**
   * Set whether two-factor authentication is enabled for the current user
   *
   * @param enabled - Whether to enable two-factor authentication
   * @returns Promise resolving when the setting is updated
   */
  setTwoFactorEnabled(enabled: boolean): Promise<void> {
    return this.rest.post<{ enabled: boolean }, void>(
      '/api/account/two-factor-enabled',
      { enabled },
      { skipHandleError: true }
    );
  }
}

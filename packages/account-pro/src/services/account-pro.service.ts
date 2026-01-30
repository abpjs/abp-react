import { RestService } from '@abpjs/core';
import type {
  RegisterRequest,
  RegisterResponse,
  TenantIdResponse,
  SendPasswordResetCodeRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  ProfileResponse,
} from '../models';

/**
 * AccountProService - Service for account-related API operations
 *
 * This is the React equivalent of Angular's AccountService from @volo/abp.ng.account.
 * Provides methods for tenant lookup, user registration, password management, and profile updates.
 *
 * @since 0.7.2
 */
export class AccountProService {
  constructor(private rest: RestService) {}

  /**
   * Find a tenant by name
   *
   * @param tenantName - The name of the tenant to find
   * @returns Promise resolving to TenantIdResponse
   */
  findTenant(tenantName: string): Promise<TenantIdResponse> {
    return this.rest.get<TenantIdResponse>(
      `/api/abp/multi-tenancy/tenants/by-name/${tenantName}`
    );
  }

  /**
   * Register a new user
   *
   * @param body - The registration request data
   * @returns Promise resolving to RegisterResponse
   */
  register(body: RegisterRequest): Promise<RegisterResponse> {
    return this.rest.post<RegisterRequest, RegisterResponse>(
      '/api/account/register',
      body,
      { skipHandleError: true }
    );
  }

  /**
   * Send password reset code to email
   * @since 0.7.2 (Pro feature)
   *
   * @param body - The password reset code request data
   * @returns Promise resolving when the email is sent
   */
  sendPasswordResetCode(body: SendPasswordResetCodeRequest): Promise<void> {
    return this.rest.post<SendPasswordResetCodeRequest, void>(
      '/api/account/send-password-reset-code',
      body,
      { skipHandleError: true }
    );
  }

  /**
   * Reset password with token
   * @since 0.7.2 (Pro feature)
   *
   * @param body - The password reset request data
   * @returns Promise resolving when the password is reset
   */
  resetPassword(body: ResetPasswordRequest): Promise<void> {
    return this.rest.post<ResetPasswordRequest, void>(
      '/api/account/reset-password',
      body,
      { skipHandleError: true }
    );
  }

  /**
   * Change password for authenticated user
   * @since 0.7.2 (Pro feature)
   *
   * @param body - The change password request data
   * @returns Promise resolving when the password is changed
   */
  changePassword(body: ChangePasswordRequest): Promise<void> {
    return this.rest.post<ChangePasswordRequest, void>(
      '/api/identity/my-profile/change-password',
      body,
      { skipHandleError: true }
    );
  }

  /**
   * Get current user profile
   * @since 0.7.2 (Pro feature)
   *
   * @returns Promise resolving to ProfileResponse
   */
  getProfile(): Promise<ProfileResponse> {
    return this.rest.get<ProfileResponse>('/api/identity/my-profile');
  }

  /**
   * Update current user profile
   * @since 0.7.2 (Pro feature)
   *
   * @param body - The profile update request data
   * @returns Promise resolving to ProfileResponse
   */
  updateProfile(body: UpdateProfileRequest): Promise<ProfileResponse> {
    return this.rest.put<UpdateProfileRequest, ProfileResponse>(
      '/api/identity/my-profile',
      body,
      { skipHandleError: true }
    );
  }
}

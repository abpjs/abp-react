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
  /**
   * The API name used for REST requests.
   * @since 2.4.0
   */
  apiName = 'default';

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

  /**
   * Send phone number confirmation token to the user's phone
   * @since 2.4.0 (Pro feature)
   *
   * @returns Promise resolving when the token is sent
   */
  sendPhoneNumberConfirmationToken(): Promise<void> {
    return this.rest.post<void, void>(
      '/api/account/send-phone-number-confirmation-token',
      undefined,
      { skipHandleError: true }
    );
  }

  /**
   * Confirm phone number with token
   * @since 2.4.0 (Pro feature)
   *
   * @param token - The confirmation token received via SMS
   * @returns Promise resolving when the phone number is confirmed
   */
  confirmPhoneNumber(token: string): Promise<void> {
    return this.rest.post<{ token: string }, void>(
      '/api/account/confirm-phone-number',
      { token },
      { skipHandleError: true }
    );
  }

  /**
   * Send email confirmation token to a new email address
   * @since 3.1.0 (Pro feature)
   *
   * @param newEmail - The new email address to send confirmation to
   * @returns Promise resolving when the token is sent
   */
  sendEmailConfirmationToken(newEmail: string): Promise<void> {
    return this.rest.post<{ newEmail: string }, void>(
      '/api/account/send-email-confirmation-token',
      { newEmail },
      { skipHandleError: true }
    );
  }

  /**
   * Confirm email address with token
   * @since 3.1.0 (Pro feature)
   *
   * @param params - The confirmation parameters
   * @param params.userId - The user ID
   * @param params.token - The confirmation token
   * @param params.tenantId - The tenant ID (optional)
   * @returns Promise resolving when the email is confirmed
   */
  confirmEmail(params: {
    userId: string;
    token: string;
    tenantId?: string;
  }): Promise<void> {
    return this.rest.post<typeof params, void>(
      '/api/account/confirm-email',
      params,
      { skipHandleError: true }
    );
  }

  /**
   * Get security logs for the current user
   * @since 3.1.0 (Pro feature)
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated security logs
   */
  getMySecurityLogs(params?: {
    startTime?: string;
    endTime?: string;
    applicationName?: string;
    identity?: string;
    action?: string;
    clientId?: string;
    correlationId?: string;
    sorting?: string;
    skipCount?: number;
    maxResultCount?: number;
  }): Promise<{
    items: Array<{
      id: string;
      tenantId?: string;
      applicationName?: string;
      identity?: string;
      action?: string;
      userId?: string;
      userName?: string;
      tenantName?: string;
      clientId?: string;
      correlationId?: string;
      clientIpAddress?: string;
      browserInfo?: string;
      creationTime: string;
    }>;
    totalCount: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = `/api/account/my-security-logs${queryString ? `?${queryString}` : ''}`;
    return this.rest.get(url);
  }
}

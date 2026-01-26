import { RestService } from '@abpjs/core';
import type { RegisterRequest, RegisterResponse, TenantIdResponse } from '../models';

/**
 * AccountService - Service for account-related API operations
 *
 * This is the React equivalent of Angular's AccountService.
 * Provides methods for tenant lookup and user registration.
 *
 * @since 0.9.0
 */
export class AccountService {
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
}

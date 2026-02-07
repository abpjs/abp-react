/**
 * Identity User Service
 * Translated from @volo/abp.ng.identity IdentityUserService
 * @since 3.2.0
 */
import type { RestService, ListResultDto, PagedResultDto } from '@abpjs/core';
import type {
  ClaimTypeDto,
  GetIdentityUsersInput,
  IdentityRoleDto,
  IdentityUserClaimDto,
  IdentityUserCreateDto,
  IdentityUserDto,
  IdentityUserUpdateDto,
  IdentityUserUpdatePasswordInput,
  IdentityUserUpdateRolesDto,
  OrganizationUnitDto,
  OrganizationUnitWithDetailsDto,
} from './models';

/**
 * Service for managing identity users
 * @since 3.2.0
 */
export class IdentityUserService {
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Creates a new user
   */
  create(input: IdentityUserCreateDto): Promise<IdentityUserDto> {
    return this.restService.request<unknown, IdentityUserDto>({
      method: 'POST',
      url: '/api/identity/users',
      body: input,
    });
  }

  /**
   * Deletes a user by ID
   */
  delete(id: string): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'DELETE',
      url: `/api/identity/users/${id}`,
    });
  }

  /**
   * Finds a user by email
   */
  findByEmail(email: string): Promise<IdentityUserDto> {
    return this.restService.request<unknown, IdentityUserDto>({
      method: 'GET',
      url: `/api/identity/users/by-email/${email}`,
    });
  }

  /**
   * Finds a user by username
   */
  findByUsername(username: string): Promise<IdentityUserDto> {
    return this.restService.request<unknown, IdentityUserDto>({
      method: 'GET',
      url: `/api/identity/users/by-username/${username}`,
    });
  }

  /**
   * Gets a user by ID
   */
  get(id: string): Promise<IdentityUserDto> {
    return this.restService.request<unknown, IdentityUserDto>({
      method: 'GET',
      url: `/api/identity/users/${id}`,
    });
  }

  /**
   * Gets all claim types available for users
   */
  getAllClaimTypes(): Promise<ClaimTypeDto[]> {
    return this.restService.request<unknown, ClaimTypeDto[]>({
      method: 'GET',
      url: '/api/identity/users/all-claim-types',
    });
  }

  /**
   * Gets assignable roles for users
   */
  getAssignableRoles(): Promise<ListResultDto<IdentityRoleDto>> {
    return this.restService.request<unknown, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: '/api/identity/users/assignable-roles',
    });
  }

  /**
   * Gets available organization units for users
   */
  getAvailableOrganizationUnits(): Promise<ListResultDto<OrganizationUnitWithDetailsDto>> {
    return this.restService.request<unknown, ListResultDto<OrganizationUnitWithDetailsDto>>({
      method: 'GET',
      url: '/api/identity/users/available-organization-units',
    });
  }

  /**
   * Gets claims for a user
   */
  getClaims(id: string): Promise<IdentityUserClaimDto[]> {
    return this.restService.request<unknown, IdentityUserClaimDto[]>({
      method: 'GET',
      url: `/api/identity/users/${id}/claims`,
    });
  }

  /**
   * Gets a paginated list of users
   */
  getList(input: GetIdentityUsersInput): Promise<PagedResultDto<IdentityUserDto>> {
    return this.restService.request<unknown, PagedResultDto<IdentityUserDto>>({
      method: 'GET',
      url: '/api/identity/users',
      params: {
        filter: input.filter,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }

  /**
   * Gets organization units for a user
   */
  getOrganizationUnits(id: string): Promise<OrganizationUnitDto[]> {
    return this.restService.request<unknown, OrganizationUnitDto[]>({
      method: 'GET',
      url: `/api/identity/users/${id}/organization-units`,
    });
  }

  /**
   * Gets roles for a user
   */
  getRoles(id: string): Promise<ListResultDto<IdentityRoleDto>> {
    return this.restService.request<unknown, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: `/api/identity/users/${id}/roles`,
    });
  }

  /**
   * Gets two-factor authentication status for a user
   */
  getTwoFactorEnabled(id: string): Promise<boolean> {
    return this.restService.request<unknown, boolean>({
      method: 'GET',
      url: `/api/identity/users/${id}/two-factor-enabled`,
    });
  }

  /**
   * Locks a user account for a specified duration
   */
  lock(id: string, lockoutDuration: number): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: `/api/identity/users/${id}/lock/${lockoutDuration}`,
    });
  }

  /**
   * Sets two-factor authentication status for a user
   */
  setTwoFactorEnabled(id: string, enabled: boolean): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: `/api/identity/users/${id}/two-factor/${enabled}`,
    });
  }

  /**
   * Unlocks a user account
   */
  unlock(id: string): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: `/api/identity/users/${id}/unlock`,
    });
  }

  /**
   * Updates a user
   */
  update(id: string, input: IdentityUserUpdateDto): Promise<IdentityUserDto> {
    return this.restService.request<unknown, IdentityUserDto>({
      method: 'PUT',
      url: `/api/identity/users/${id}`,
      body: input,
    });
  }

  /**
   * Updates claims for a user
   */
  updateClaims(id: string, input: IdentityUserClaimDto[]): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: `/api/identity/users/${id}/claims`,
      body: input,
    });
  }

  /**
   * Updates password for a user (admin action)
   */
  updatePassword(id: string, input: IdentityUserUpdatePasswordInput): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: `/api/identity/users/${id}/change-password`,
      body: input,
    });
  }

  /**
   * Updates roles for a user
   */
  updateRoles(id: string, input: IdentityUserUpdateRolesDto): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: `/api/identity/users/${id}/roles`,
      body: input,
    });
  }
}

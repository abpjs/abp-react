/**
 * Identity Role Service
 * Translated from @volo/abp.ng.identity IdentityRoleService
 * @since 3.2.0
 */
import type { RestService, ListResultDto, PagedResultDto } from '@abpjs/core';
import type {
  ClaimTypeDto,
  GetIdentityRoleListInput,
  IdentityRoleClaimDto,
  IdentityRoleCreateDto,
  IdentityRoleDto,
  IdentityRoleUpdateDto,
} from './models';

/**
 * Service for managing identity roles
 * @since 3.2.0
 */
export class IdentityRoleService {
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Creates a new role
   */
  create(input: IdentityRoleCreateDto): Promise<IdentityRoleDto> {
    return this.restService.request<unknown, IdentityRoleDto>({
      method: 'POST',
      url: '/api/identity/roles',
      body: input,
    });
  }

  /**
   * Deletes a role by ID
   */
  delete(id: string): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'DELETE',
      url: `/api/identity/roles/${id}`,
    });
  }

  /**
   * Gets a role by ID
   */
  get(id: string): Promise<IdentityRoleDto> {
    return this.restService.request<unknown, IdentityRoleDto>({
      method: 'GET',
      url: `/api/identity/roles/${id}`,
    });
  }

  /**
   * Gets all claim types available for roles
   */
  getAllClaimTypes(): Promise<ClaimTypeDto[]> {
    return this.restService.request<unknown, ClaimTypeDto[]>({
      method: 'GET',
      url: '/api/identity/roles/all-claim-types',
    });
  }

  /**
   * Gets all roles without pagination
   */
  getAllList(): Promise<ListResultDto<IdentityRoleDto>> {
    return this.restService.request<unknown, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: '/api/identity/roles/all',
    });
  }

  /**
   * Gets claims for a role
   */
  getClaims(id: string): Promise<IdentityRoleClaimDto[]> {
    return this.restService.request<unknown, IdentityRoleClaimDto[]>({
      method: 'GET',
      url: `/api/identity/roles/${id}/claims`,
    });
  }

  /**
   * Gets a paginated list of roles
   */
  getList(input: GetIdentityRoleListInput): Promise<PagedResultDto<IdentityRoleDto>> {
    return this.restService.request<unknown, PagedResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: '/api/identity/roles',
      params: {
        filter: input.filter,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }

  /**
   * Updates a role
   */
  update(id: string, input: IdentityRoleUpdateDto): Promise<IdentityRoleDto> {
    return this.restService.request<unknown, IdentityRoleDto>({
      method: 'PUT',
      url: `/api/identity/roles/${id}`,
      body: input,
    });
  }

  /**
   * Updates claims for a role
   */
  updateClaims(id: string, input: IdentityRoleClaimDto[]): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: `/api/identity/roles/${id}/claims`,
      body: input,
    });
  }
}

/**
 * Identity Claim Type Service
 * Translated from @volo/abp.ng.identity IdentityClaimTypeService
 * @since 3.2.0
 */
import type { RestService, PagedResultDto } from '@abpjs/core';
import type {
  ClaimTypeDto,
  CreateClaimTypeDto,
  GetIdentityClaimTypesInput,
  UpdateClaimTypeDto,
} from './models';

/**
 * Service for managing identity claim types
 * @since 3.2.0
 */
export class IdentityClaimTypeService {
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Creates a new claim type
   */
  create(input: CreateClaimTypeDto): Promise<ClaimTypeDto> {
    return this.restService.request<unknown, ClaimTypeDto>({
      method: 'POST',
      url: '/api/identity/claim-types',
      body: input,
    });
  }

  /**
   * Deletes a claim type by ID
   */
  delete(id: string): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'DELETE',
      url: `/api/identity/claim-types/${id}`,
    });
  }

  /**
   * Gets a claim type by ID
   */
  get(id: string): Promise<ClaimTypeDto> {
    return this.restService.request<unknown, ClaimTypeDto>({
      method: 'GET',
      url: `/api/identity/claim-types/${id}`,
    });
  }

  /**
   * Gets a paginated list of claim types
   */
  getList(input: GetIdentityClaimTypesInput): Promise<PagedResultDto<ClaimTypeDto>> {
    return this.restService.request<unknown, PagedResultDto<ClaimTypeDto>>({
      method: 'GET',
      url: '/api/identity/claim-types',
      params: {
        filter: input.filter,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }

  /**
   * Updates a claim type
   */
  update(id: string, input: UpdateClaimTypeDto): Promise<ClaimTypeDto> {
    return this.restService.request<unknown, ClaimTypeDto>({
      method: 'PUT',
      url: `/api/identity/claim-types/${id}`,
      body: input,
    });
  }
}

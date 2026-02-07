/**
 * Identity User Lookup Service
 * Translated from @volo/abp.ng.identity IdentityUserLookupService
 * @since 3.2.0
 */
import type { RestService, ListResultDto } from '@abpjs/core';
import type { UserLookupCountInputDto, UserLookupSearchInputDto } from './models';
import type { UserData } from '../users/models';

/**
 * Service for looking up users
 * @since 3.2.0
 */
export class IdentityUserLookupService {
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Finds a user by ID
   */
  findById(id: string): Promise<UserData> {
    return this.restService.request<unknown, UserData>({
      method: 'GET',
      url: `/api/identity/users/lookup/${id}`,
    });
  }

  /**
   * Finds a user by username
   */
  findByUserName(userName: string): Promise<UserData> {
    return this.restService.request<unknown, UserData>({
      method: 'GET',
      url: `/api/identity/users/lookup/by-username/${userName}`,
    });
  }

  /**
   * Gets the count of users matching the filter
   */
  getCount(input: UserLookupCountInputDto): Promise<number> {
    return this.restService.request<unknown, number>({
      method: 'GET',
      url: '/api/identity/users/lookup/count',
      params: {
        filter: input.filter,
      },
    });
  }

  /**
   * Searches for users
   */
  search(input: UserLookupSearchInputDto): Promise<ListResultDto<UserData>> {
    return this.restService.request<unknown, ListResultDto<UserData>>({
      method: 'GET',
      url: '/api/identity/users/lookup/search',
      params: {
        filter: input.filter,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }
}

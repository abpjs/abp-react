import type { ListResultDto } from '@abpjs/core';
import { RestService } from '@abpjs/core';
import type { UserLookupCountInputDto, UserLookupSearchInputDto } from './models';
import type { UserData } from '../users/models';

/**
 * Identity User Lookup proxy service for user lookup API calls
 * Translated from @abp/ng.identity v3.2.0
 *
 * @since 3.2.0
 */
export class IdentityUserLookupService {
  private restService: RestService;

  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(restService: RestService) {
    this.restService = restService;
  }

  /**
   * Find a user by ID
   * @param id - The user ID
   * @returns Promise with the user data
   */
  findById = (id: string): Promise<UserData> => {
    return this.restService.request<void, UserData>({
      method: 'GET',
      url: `/api/identity/users/lookup/${id}`,
    });
  };

  /**
   * Find a user by username
   * @param userName - The username to search for
   * @returns Promise with the user data
   */
  findByUserName = (userName: string): Promise<UserData> => {
    return this.restService.request<void, UserData>({
      method: 'GET',
      url: `/api/identity/users/lookup/by-username/${userName}`,
    });
  };

  /**
   * Get count of users matching filter
   * @param input - Filter parameters
   * @returns Promise with the count
   */
  getCount = (input: UserLookupCountInputDto): Promise<number> => {
    return this.restService.request<void, number>({
      method: 'GET',
      url: '/api/identity/users/lookup/count',
      params: input,
    });
  };

  /**
   * Search for users
   * @param input - Search and pagination parameters
   * @returns Promise with matching users
   */
  search = (input: UserLookupSearchInputDto): Promise<ListResultDto<UserData>> => {
    return this.restService.request<void, ListResultDto<UserData>>({
      method: 'GET',
      url: '/api/identity/users/lookup/search',
      params: input,
    });
  };
}

import { RestService } from '@abpjs/core';
import type { GetFeatureListResultDto, UpdateFeaturesDto } from '../models';

/**
 * Features proxy service for feature management API calls
 * This is the new proxy service introduced in v3.2.0
 *
 * @since 3.2.0
 */
export class FeaturesService {
  private restService: RestService;

  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(restService: RestService) {
    this.restService = restService;
  }

  /**
   * Get features for a provider
   * @param providerName The provider name (e.g., 'T' for Tenant)
   * @param providerKey The provider key (e.g., tenant ID)
   * @returns Promise with feature list result
   */
  get = (
    providerName: string,
    providerKey: string
  ): Promise<GetFeatureListResultDto> => {
    return this.restService.request<void, GetFeatureListResultDto>({
      method: 'GET',
      url: '/api/feature-management/features',
      params: { providerName, providerKey },
    });
  };

  /**
   * Update features for a provider
   * @param providerName The provider name
   * @param providerKey The provider key
   * @param input The features to update
   * @returns Promise that resolves when update completes
   */
  update = (
    providerName: string,
    providerKey: string,
    input: UpdateFeaturesDto
  ): Promise<void> => {
    return this.restService.request<UpdateFeaturesDto, void>({
      method: 'PUT',
      url: '/api/feature-management/features',
      body: input,
      params: { providerName, providerKey },
    });
  };
}

import { RestService } from '@abpjs/core';
import { FeatureManagement } from '../models';

/**
 * Service for feature management API calls
 * Translated from @abp/ng.feature-management v0.8.0
 */
export class FeatureManagementService {
  private rest: RestService;

  constructor(rest: RestService) {
    this.rest = rest;
  }

  /**
   * Get features for a provider
   * @param params Provider key and name
   * @returns Promise with features response
   */
  getFeatures(
    params: FeatureManagement.Provider
  ): Promise<FeatureManagement.Features> {
    return this.rest.request<void, FeatureManagement.Features>({
      method: 'GET',
      url: '/api/abp/features',
      params,
    });
  }

  /**
   * Update features for a provider
   * @param request Update request with features, providerKey and providerName
   * @returns Promise that resolves when update completes
   */
  updateFeatures(
    request: FeatureManagement.Provider & FeatureManagement.Features
  ): Promise<void> {
    const { features, providerKey, providerName } = request;

    return this.rest.request<FeatureManagement.Features, void>({
      method: 'PUT',
      url: '/api/abp/features',
      body: { features },
      params: { providerKey, providerName },
    });
  }
}

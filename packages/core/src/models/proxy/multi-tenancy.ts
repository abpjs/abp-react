/**
 * Multi-tenancy proxy models
 * Translated from @abp/ng.core v4.0.0
 *
 * @since 4.0.0
 */

export interface FindTenantResultDto {
  success: boolean;
  tenantId?: string;
  name?: string;
}

export interface CurrentTenantDto {
  id?: string;
  name?: string;
  isAvailable?: boolean;
}

export interface MultiTenancyInfoDto {
  isEnabled: boolean;
}

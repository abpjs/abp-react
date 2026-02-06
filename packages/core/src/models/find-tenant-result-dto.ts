/**
 * FindTenantResultDto - Result of tenant lookup operations
 * Translated from @abp/ng.core v3.1.0
 *
 * @since 3.1.0
 */

export class FindTenantResultDto {
  success: boolean;
  tenantId?: string;
  name: string;

  constructor(initialValues?: Partial<FindTenantResultDto>) {
    this.success = initialValues?.success ?? false;
    this.name = initialValues?.name ?? '';
    this.tenantId = initialValues?.tenantId;
  }
}

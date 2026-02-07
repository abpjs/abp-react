export { TenantManagementService } from './tenant-management.service';
export {
  TenantManagementStateService,
  getTenantManagementStateService,
} from './tenant-management-state.service';

// Re-export TenantService from proxy for convenience (v3.2.0)
export { TenantService } from '../proxy/tenant.service';

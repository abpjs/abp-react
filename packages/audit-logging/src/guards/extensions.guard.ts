/**
 * Audit Logging Extensions Guard
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 *
 * Guard that ensures audit logging extensions are initialized before route activation.
 * @since 3.0.0
 */

/**
 * Guard function to check if audit logging extensions are ready.
 * In React, this is typically used with react-router's loader or guard patterns.
 *
 * @returns Promise that resolves to true when extensions are ready
 */
export async function auditLoggingExtensionsGuard(): Promise<boolean> {
  // Extensions are initialized on module load in React
  // This guard is kept for API compatibility and can be extended
  // to perform additional initialization checks if needed
  return true;
}

/**
 * Check if audit logging extensions can be activated.
 * This is a synchronous version of the guard for immediate checks.
 *
 * @returns true if extensions are ready
 */
export function canActivateAuditLoggingExtensions(): boolean {
  // In React, extensions are ready as soon as the module is loaded
  return true;
}

/**
 * React Router loader function for audit logging routes.
 * Can be used with react-router's route loader pattern.
 *
 * @returns Promise that resolves when extensions are ready
 */
export async function auditLoggingExtensionsLoader(): Promise<{ ready: boolean }> {
  const ready = await auditLoggingExtensionsGuard();
  return { ready };
}

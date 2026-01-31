import { useState, useCallback, useMemo } from 'react';
import { useRestService } from '@abpjs/core';
import { PermissionManagement, PermissionWithMargin } from '../models';
import { PermissionManagementService } from '../services';

/**
 * Result from permission management operations
 */
export interface PermissionManagementResult {
  success: boolean;
  error?: string;
}

/**
 * Return type for usePermissionManagement hook
 */
export interface UsePermissionManagementReturn {
  /** Current permission groups */
  groups: PermissionManagement.Group[];
  /** Entity display name */
  entityDisplayName: string;
  /** Currently selected group */
  selectedGroup: PermissionManagement.Group | null;
  /** Permissions with current grant state (modifiable) */
  permissions: PermissionManagement.MinimumPermission[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether "select all in tab" is checked */
  selectThisTab: boolean;
  /** Whether "select all" is checked */
  selectAllTab: boolean;
  /** Fetch permissions for a provider */
  fetchPermissions: (
    providerKey: string,
    providerName: string
  ) => Promise<PermissionManagementResult>;
  /** Update permissions on the server */
  savePermissions: (
    providerKey: string,
    providerName: string
  ) => Promise<PermissionManagementResult>;
  /** Change the selected group */
  setSelectedGroup: (group: PermissionManagement.Group) => void;
  /** Toggle a single permission */
  togglePermission: (permission: PermissionManagement.Permission) => void;
  /** Toggle all permissions in current tab */
  toggleSelectThisTab: () => void;
  /** Toggle all permissions */
  toggleSelectAll: () => void;
  /** Get permissions for currently selected group with margin */
  getSelectedGroupPermissions: () => PermissionWithMargin[];
  /** Check if a permission is granted */
  isGranted: (permissionName: string) => boolean;
  /**
   * Check if a permission is granted by another provider name
   * @since 1.1.0 (renamed from isGrantedByRole)
   */
  isGrantedByOtherProviderName: (
    grantedProviders: PermissionManagement.GrantedProvider[],
    providerName: string
  ) => boolean;
  /**
   * @deprecated Use isGrantedByOtherProviderName instead
   */
  isGrantedByRole: (grantedProviders: PermissionManagement.GrantedProvider[]) => boolean;
  /** Reset state */
  reset: () => void;
}

/**
 * Calculate margin/indentation for a permission based on parent hierarchy
 */
function findMargin(
  permissions: PermissionManagement.Permission[],
  permission: PermissionManagement.Permission
): number {
  const parentPermission = permissions.find((per) => per.name === permission.parentName);

  if (parentPermission && parentPermission.parentName) {
    let margin = 20;
    return (margin += findMargin(permissions, parentPermission));
  }

  return parentPermission ? 20 : 0;
}

/**
 * Extract all permissions from groups into a flat array
 */
function getPermissionsFromGroups(
  groups: PermissionManagement.Group[]
): PermissionManagement.MinimumPermission[] {
  return groups.reduce<PermissionManagement.MinimumPermission[]>(
    (acc, group) => [
      ...acc,
      ...group.permissions.map((p) => ({ name: p.name, isGranted: p.isGranted })),
    ],
    []
  );
}

/**
 * Hook for managing permissions
 *
 * This hook provides all the state and actions needed for the permission
 * management modal. It handles fetching, modifying, and saving permissions.
 *
 * @example
 * ```tsx
 * function PermissionModal({ providerKey, providerName }) {
 *   const {
 *     groups,
 *     selectedGroup,
 *     isLoading,
 *     fetchPermissions,
 *     savePermissions,
 *   } = usePermissionManagement();
 *
 *   useEffect(() => {
 *     fetchPermissions(providerKey, providerName);
 *   }, [providerKey, providerName]);
 *
 *   return (
 *     // ... modal UI
 *   );
 * }
 * ```
 */
export function usePermissionManagement(): UsePermissionManagementReturn {
  const restService = useRestService();

  // Service instance (memoized)
  const service = useMemo(() => new PermissionManagementService(restService), [restService]);

  // State
  const [groups, setGroups] = useState<PermissionManagement.Group[]>([]);
  const [entityDisplayName, setEntityDisplayName] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<PermissionManagement.Group | null>(null);
  const [permissions, setPermissions] = useState<PermissionManagement.MinimumPermission[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<
    PermissionManagement.MinimumPermission[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectThisTab, setSelectThisTab] = useState(false);
  const [selectAllTab, setSelectAllTab] = useState(false);

  /**
   * Check if a permission is granted
   */
  const isGranted = useCallback(
    (permissionName: string): boolean => {
      const permission = permissions.find((p) => p.name === permissionName);
      return permission?.isGranted ?? false;
    },
    [permissions]
  );

  /**
   * Check if a permission is granted by another provider name (v1.1.0)
   * This is useful for showing visual indicators when a permission
   * comes from another provider (like a role) rather than being directly assigned.
   */
  const isGrantedByOtherProviderName = useCallback(
    (grantedProviders: PermissionManagement.GrantedProvider[], providerName: string): boolean => {
      return grantedProviders.some((provider) => provider.providerName !== providerName);
    },
    []
  );

  /**
   * @deprecated Use isGrantedByOtherProviderName instead
   * Check if a permission is granted by a role provider
   */
  const isGrantedByRole = useCallback(
    (grantedProviders: PermissionManagement.GrantedProvider[]): boolean => {
      return grantedProviders.some((provider) => provider.providerName === 'R');
    },
    []
  );

  /**
   * Get permissions for the currently selected group with margins calculated
   */
  const getSelectedGroupPermissions = useCallback((): PermissionWithMargin[] => {
    if (!selectedGroup) return [];

    const groupPermissions = groups.find((g) => g.name === selectedGroup.name)?.permissions ?? [];

    return groupPermissions.map((permission) => ({
      ...permission,
      margin: findMargin(groupPermissions, permission),
      isGranted: isGranted(permission.name),
    }));
  }, [selectedGroup, groups, isGranted]);

  /**
   * Update checkbox states based on current permissions
   */
  const updateCheckboxStates = useCallback(() => {
    // Update "select this tab" state
    if (selectedGroup) {
      const groupPermissions = groups.find((g) => g.name === selectedGroup.name)?.permissions ?? [];
      const grantedCount = groupPermissions.filter((p) => isGranted(p.name)).length;

      if (grantedCount === groupPermissions.length) {
        setSelectThisTab(true);
      } else if (grantedCount === 0) {
        setSelectThisTab(false);
      }
      // Note: indeterminate state is handled in the component
    }

    // Update "select all" state
    const allGrantedCount = permissions.filter((p) => p.isGranted).length;
    if (allGrantedCount === permissions.length) {
      setSelectAllTab(true);
    } else if (allGrantedCount === 0) {
      setSelectAllTab(false);
    }
  }, [selectedGroup, groups, permissions, isGranted]);

  /**
   * Fetch permissions from the server
   */
  const fetchPermissions = useCallback(
    async (providerKey: string, providerName: string): Promise<PermissionManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.getPermissions({
          providerKey,
          providerName,
        });

        setGroups(response.groups);
        setEntityDisplayName(response.entityDisplayName);

        // Set first group as selected
        if (response.groups.length > 0) {
          setSelectedGroup(response.groups[0]);
        }

        // Extract permissions for local state management
        const perms = getPermissionsFromGroups(response.groups);
        setPermissions(perms);
        setOriginalPermissions(perms);

        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch permissions';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Save changed permissions to the server
   */
  const savePermissions = useCallback(
    async (providerKey: string, providerName: string): Promise<PermissionManagementResult> => {
      // Find changed permissions
      const changedPermissions = permissions.filter((perm) => {
        const original = originalPermissions.find((o) => o.name === perm.name);
        return original && original.isGranted !== perm.isGranted;
      });

      // If nothing changed, just return success
      if (changedPermissions.length === 0) {
        return { success: true };
      }

      setIsLoading(true);
      setError(null);

      try {
        await service.updatePermissions({
          providerKey,
          providerName,
          permissions: changedPermissions.map(({ name, isGranted }) => ({
            name,
            isGranted,
          })),
        });

        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update permissions';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, permissions, originalPermissions]
  );

  /**
   * Toggle a single permission (handles parent/child relationships)
   */
  const togglePermission = useCallback(
    (clickedPermission: PermissionManagement.Permission) => {
      setPermissions((currentPermissions) => {
        const clickedPerm = currentPermissions.find((p) => p.name === clickedPermission.name);
        const wasGranted = clickedPerm?.isGranted ?? false;

        return currentPermissions.map((perm) => {
          // Toggle the clicked permission
          if (clickedPermission.name === perm.name) {
            return { ...perm, isGranted: !perm.isGranted };
          }

          // If parent is being unchecked, uncheck children
          if (clickedPermission.name === clickedPermission.parentName && wasGranted) {
            // This is handled below
          }

          // Find if this perm is a child of clicked permission
          const allPerms = groups.flatMap((g) => g.permissions);
          const thisPerm = allPerms.find((p) => p.name === perm.name);

          if (thisPerm?.parentName === clickedPermission.name && wasGranted) {
            // Parent was checked and is being unchecked - uncheck children
            return { ...perm, isGranted: false };
          }

          // If child is being checked, ensure parent is checked
          if (clickedPermission.parentName === perm.name && !wasGranted) {
            return { ...perm, isGranted: true };
          }

          return perm;
        });
      });

      // Update checkbox states after a short delay (to let state update)
      setTimeout(updateCheckboxStates, 0);
    },
    [groups, updateCheckboxStates]
  );

  /**
   * Toggle all permissions in the current tab
   */
  const toggleSelectThisTab = useCallback(() => {
    if (!selectedGroup) return;

    const groupPermissionNames = new Set(
      groups.find((g) => g.name === selectedGroup.name)?.permissions.map((p) => p.name) ?? []
    );

    const newGrantedState = !selectThisTab;

    setPermissions((currentPermissions) =>
      currentPermissions.map((perm) =>
        groupPermissionNames.has(perm.name) ? { ...perm, isGranted: newGrantedState } : perm
      )
    );

    setSelectThisTab(newGrantedState);

    // Update the "select all" state
    setTimeout(updateCheckboxStates, 0);
  }, [selectedGroup, groups, selectThisTab, updateCheckboxStates]);

  /**
   * Toggle all permissions
   */
  const toggleSelectAll = useCallback(() => {
    const newGrantedState = !selectAllTab;

    setPermissions((currentPermissions) =>
      currentPermissions.map((perm) => ({ ...perm, isGranted: newGrantedState }))
    );

    setSelectAllTab(newGrantedState);
    setSelectThisTab(newGrantedState);
  }, [selectAllTab]);

  /**
   * Handle group selection change
   */
  const handleSetSelectedGroup = useCallback(
    (group: PermissionManagement.Group) => {
      setSelectedGroup(group);
      // Update tab checkbox state for new group
      setTimeout(updateCheckboxStates, 0);
    },
    [updateCheckboxStates]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setGroups([]);
    setEntityDisplayName('');
    setSelectedGroup(null);
    setPermissions([]);
    setOriginalPermissions([]);
    setIsLoading(false);
    setError(null);
    setSelectThisTab(false);
    setSelectAllTab(false);
  }, []);

  return {
    groups,
    entityDisplayName,
    selectedGroup,
    permissions,
    isLoading,
    error,
    selectThisTab,
    selectAllTab,
    fetchPermissions,
    savePermissions,
    setSelectedGroup: handleSetSelectedGroup,
    togglePermission,
    toggleSelectThisTab,
    toggleSelectAll,
    getSelectedGroupPermissions,
    isGranted,
    isGrantedByOtherProviderName,
    isGrantedByRole,
    reset,
  };
}

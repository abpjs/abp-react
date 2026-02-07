import React, { useEffect, useRef, useCallback } from 'react';
import { useLocalization } from '@abpjs/core';
import { Modal, Alert, Button, Checkbox } from '@abpjs/theme-shared';
import {
  Badge,
  Box,
  Flex,
  Heading,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { usePermissionManagement } from '../../hooks';
import type { PermissionGrantInfoDto, PermissionGroupDto } from '../../proxy/models';

/**
 * Props for PermissionManagementModal component
 */
export interface PermissionManagementModalProps {
  /**
   * Provider name (e.g., 'R' for Role, 'U' for User)
   */
  providerName: string;

  /**
   * Provider key (e.g., role ID or user ID)
   */
  providerKey: string;

  /**
   * Whether the modal is visible
   */
  visible: boolean;

  /**
   * Callback when visibility changes
   */
  onVisibleChange?: (visible: boolean) => void;

  /**
   * Callback fired when permissions are saved successfully
   */
  onSave?: () => void;

  /**
   * Hide the provider badges on permissions
   * When true, badges showing which provider granted a permission are hidden.
   * @since 1.1.0
   */
  hideBadges?: boolean;
}

/**
 * PermissionManagementModal - Modal for managing entity permissions
 *
 * This is the React equivalent of Angular's PermissionManagementComponent.
 * It displays a modal with permission groups and allows toggling permissions.
 *
 * @example
 * ```tsx
 * function RolePermissions({ roleId }) {
 *   const [visible, setVisible] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setVisible(true)}>Manage Permissions</Button>
 *       <PermissionManagementModal
 *         providerName="R"
 *         providerKey={roleId}
 *         visible={visible}
 *         onVisibleChange={setVisible}
 *         onSave={() => console.log('Saved!')}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function PermissionManagementModal({
  providerName,
  providerKey,
  visible,
  onVisibleChange,
  onSave,
  hideBadges = false,
}: PermissionManagementModalProps): React.ReactElement {
  const { t } = useLocalization();

  const {
    groups,
    entityDisplayName,
    selectedGroup,
    isLoading,
    error,
    selectThisTab,
    selectAllTab,
    fetchPermissions,
    savePermissions,
    setSelectedGroup,
    togglePermission,
    toggleSelectThisTab,
    toggleSelectAll,
    getSelectedGroupPermissions,
    isGranted,
    isGrantedByOtherProviderName,
    reset,
  } = usePermissionManagement();

  // Refs for indeterminate checkbox state
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const selectThisTabCheckboxRef = useRef<HTMLInputElement>(null);

  /**
   * Fetch permissions when modal opens
   */
  useEffect(() => {
    if (visible && providerKey && providerName) {
      fetchPermissions(providerKey, providerName);
    }

    // Reset when modal closes
    if (!visible) {
      reset();
    }
  }, [visible, providerKey, providerName, fetchPermissions, reset]);

  /**
   * Update indeterminate state for "select all" checkbox
   */
  useEffect(() => {
    if (!selectAllCheckboxRef.current) return;

    const allPermissions = groups.flatMap((g) => g.permissions);
    const grantedCount = allPermissions.filter((p) => isGranted(p.name)).length;

    if (grantedCount === 0) {
      selectAllCheckboxRef.current.indeterminate = false;
    } else if (grantedCount === allPermissions.length) {
      selectAllCheckboxRef.current.indeterminate = false;
    } else {
      selectAllCheckboxRef.current.indeterminate = true;
    }
  }, [groups, isGranted]);

  /**
   * Update indeterminate state for "select this tab" checkbox
   */
  useEffect(() => {
    if (!selectThisTabCheckboxRef.current || !selectedGroup) return;

    const groupPermissions = groups.find((g) => g.name === selectedGroup.name)?.permissions ?? [];
    const grantedCount = groupPermissions.filter((p) => isGranted(p.name)).length;

    if (grantedCount === 0) {
      selectThisTabCheckboxRef.current.indeterminate = false;
    } else if (grantedCount === groupPermissions.length) {
      selectThisTabCheckboxRef.current.indeterminate = false;
    } else {
      selectThisTabCheckboxRef.current.indeterminate = true;
    }
  }, [selectedGroup, groups, isGranted]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    const result = await savePermissions(providerKey, providerName);

    if (result.success) {
      onSave?.();
      onVisibleChange?.(false);
    }
  }, [savePermissions, providerKey, providerName, onSave, onVisibleChange]);

  /**
   * Handle modal close
   */
  const handleClose = useCallback(() => {
    onVisibleChange?.(false);
  }, [onVisibleChange]);

  /**
   * Handle permission checkbox click
   */
  const handlePermissionClick = useCallback(
    (permission: PermissionGrantInfoDto) => {
      togglePermission(permission);
    },
    [togglePermission]
  );

  /**
   * Handle group selection
   */
  const handleGroupClick = useCallback(
    (group: PermissionGroupDto) => {
      setSelectedGroup(group);
    },
    [setSelectedGroup]
  );

  // Get permissions for selected group with margins
  const selectedGroupPermissions = getSelectedGroupPermissions();

  return (
    <Modal
      visible={visible}
      onVisibleChange={onVisibleChange}
      size="xl"
      header={
        <>
          {t('AbpPermissionManagement::Permissions')}
          {entityDisplayName && ` - ${entityDisplayName}`}
        </>
      }
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t('AbpIdentity::Cancel')}
          </Button>
          <Button
            colorPalette="blue"
            onClick={handleSubmit}
            loading={isLoading}
          >
            {t('AbpIdentity::Save')}
          </Button>
        </>
      }
    >
      {/* Loading State */}
      {isLoading && groups.length === 0 && (
        <Flex justify="center" align="center" py={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Error State */}
      {error && (
        <Alert status="error" mb={4}>
          {error}
        </Alert>
      )}

      {/* Content */}
      {groups.length > 0 && (
        <Box>
          {/* Select All Checkbox */}
          <Checkbox
            ref={selectAllCheckboxRef}
            id="select-all-in-all-tabs"
            checked={selectAllTab}
            onChange={toggleSelectAll}
          >
            {t('AbpPermissionManagement::SelectAllInAllTabs')}
          </Checkbox>

          <Box borderBottomWidth="1px" borderColor="gray.200" my={2} />

          <Flex gap={4}>
            {/* Left Panel - Group List */}
            <Box w="35%" maxH="70vh" overflowY="auto">
              <VStack gap={0} align="stretch">
                {groups.map((group) => (
                  <Box
                    key={group.name}
                    px={3}
                    py={2}
                    cursor="pointer"
                    bg={selectedGroup?.name === group.name ? 'blue.500' : 'transparent'}
                    color={selectedGroup?.name === group.name ? 'white' : 'inherit'}
                    borderRadius="md"
                    _hover={{
                      bg: selectedGroup?.name === group.name ? 'blue.600' : 'gray.100',
                    }}
                    onClick={() => handleGroupClick(group)}
                  >
                    {group.displayName}
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Right Panel - Permissions */}
            <Box w="65%">
              {selectedGroup && (
                <>
                  <Heading as="h4" size="md" mb={2}>
                    {selectedGroup.displayName}
                  </Heading>

                  <Box borderBottomWidth="1px" borderColor="gray.200" my={2} />

                  <Box pl={1} pt={1}>
                    {/* Select All in This Tab */}
                    <Checkbox
                      ref={selectThisTabCheckboxRef}
                      id="select-all-in-this-tabs"
                      checked={selectThisTab}
                      onChange={toggleSelectThisTab}
                    >
                      {t('AbpPermissionManagement::SelectAllInThisTab')}
                    </Checkbox>

                    <Box borderBottomWidth="1px" borderColor="gray.200" my={3} />

                    {/* Permission List */}
                    <Box maxH="60vh" overflowY="auto">
                      <VStack align="stretch" gap={2}>
                        {selectedGroupPermissions.map((permission) => (
                          <Box key={permission.name} ml={`${permission.margin}px`}>
                            <Flex align="center" gap={2}>
                              <Checkbox
                                id={permission.name}
                                checked={isGranted(permission.name)}
                                onChange={() => handlePermissionClick(permission)}
                              >
                                {permission.displayName}
                              </Checkbox>
                              {/* Show provider badges when hideBadges is false (v1.1.0) */}
                              {!hideBadges &&
                                permission.grantedProviders &&
                                isGrantedByOtherProviderName(permission.grantedProviders, providerName) && (
                                  <Badge colorPalette="blue" size="sm">
                                    {permission.grantedProviders
                                      .filter((p) => p.providerName !== providerName)
                                      .map((p) => p.providerName)
                                      .join(', ')}
                                  </Badge>
                                )}
                            </Flex>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Flex>
        </Box>
      )}
    </Modal>
  );
}

export default PermissionManagementModal;

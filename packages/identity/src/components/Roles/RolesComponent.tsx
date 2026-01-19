import React, { useEffect, useState, useCallback } from 'react';
import { useLocalization } from '@abpjs/core';
import { Modal, useConfirmation, Toaster, Alert, Button, Checkbox, FormField } from '@abpjs/theme-shared';
import { PermissionManagementModal } from '@abpjs/permission-management';
import {
  Box,
  Flex,
  Input,
  Table,
  Spinner,
  VStack,
  Menu,
  Text,
} from '@chakra-ui/react';
import { useRoles } from '../../hooks';
import type { Identity } from '../../models';

/**
 * Props for RolesComponent
 */
export interface RolesComponentProps {
  /** Optional callback when a role is created */
  onRoleCreated?: (role: Identity.RoleItem) => void;
  /** Optional callback when a role is updated */
  onRoleUpdated?: (role: Identity.RoleItem) => void;
  /** Optional callback when a role is deleted */
  onRoleDeleted?: (id: string) => void;
}

/**
 * Form state for role modal
 */
interface RoleFormState {
  name: string;
  isDefault: boolean;
  isPublic: boolean;
}

const DEFAULT_FORM_STATE: RoleFormState = {
  name: '',
  isDefault: false,
  isPublic: false,
};

/**
 * RolesComponent - Component for managing roles
 *
 * This is the React equivalent of Angular's RolesComponent.
 * It displays a table of roles with CRUD operations and permission management.
 *
 * @example
 * ```tsx
 * function IdentityPage() {
 *   return (
 *     <RolesComponent
 *       onRoleCreated={(role) => console.log('Role created:', role)}
 *       onRoleDeleted={(id) => console.log('Role deleted:', id)}
 *     />
 *   );
 * }
 * ```
 */
export function RolesComponent({
  onRoleCreated,
  onRoleUpdated,
  onRoleDeleted,
}: RolesComponentProps): React.ReactElement {
  const { t } = useLocalization();
  const confirmation = useConfirmation();

  const {
    roles,
    selectedRole,
    isLoading,
    error,
    fetchRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    setSelectedRole,
  } = useRoles();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<RoleFormState>(DEFAULT_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Permission modal state
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionProviderKey, setPermissionProviderKey] = useState('');

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      !searchTerm || role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handle add new role
   */
  const handleAdd = useCallback(() => {
    setSelectedRole(null);
    setFormState(DEFAULT_FORM_STATE);
    setIsModalOpen(true);
  }, [setSelectedRole]);

  /**
   * Handle edit role
   */
  const handleEdit = useCallback(
    async (id: string) => {
      const result = await getRoleById(id);
      if (result.success && selectedRole) {
        setFormState({
          name: selectedRole.name || '',
          isDefault: selectedRole.isDefault || false,
          isPublic: selectedRole.isPublic || false,
        });
        setIsModalOpen(true);
      }
    },
    [getRoleById, selectedRole]
  );

  // Update form when selectedRole changes
  useEffect(() => {
    if (selectedRole) {
      setFormState({
        name: selectedRole.name || '',
        isDefault: selectedRole.isDefault || false,
        isPublic: selectedRole.isPublic || false,
      });
    }
  }, [selectedRole]);

  /**
   * Handle delete role
   */
  const handleDelete = useCallback(
    async (id: string, name: string) => {
      const status = await confirmation.warn(
        t('AbpIdentity::RoleDeletionConfirmationMessage', name),
        t('AbpIdentity::AreYouSure')
      );

      if (status === Toaster.Status.confirm) {
        const result = await deleteRole(id);
        if (result.success) {
          onRoleDeleted?.(id);
        }
      }
    },
    [confirmation, t, deleteRole, onRoleDeleted]
  );

  /**
   * Handle open permissions modal
   */
  const handleOpenPermissions = useCallback((roleName: string) => {
    setPermissionProviderKey(roleName);
    setIsPermissionModalOpen(true);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!formState.name.trim()) return;

    setIsSubmitting(true);

    const roleData: Identity.RoleSaveRequest = {
      name: formState.name.trim(),
      isDefault: formState.isDefault,
      isPublic: formState.isPublic,
    };

    let result;
    if (selectedRole?.id) {
      result = await updateRole(selectedRole.id, roleData);
      if (result.success) {
        onRoleUpdated?.({ ...selectedRole, ...roleData });
      }
    } else {
      result = await createRole(roleData);
      if (result.success) {
        onRoleCreated?.({ ...roleData, id: '', isStatic: false, concurrencyStamp: '' });
      }
    }

    setIsSubmitting(false);

    if (result.success) {
      setIsModalOpen(false);
      setFormState(DEFAULT_FORM_STATE);
      setSelectedRole(null);
    }
  }, [formState, selectedRole, updateRole, createRole, onRoleCreated, onRoleUpdated, setSelectedRole]);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setFormState(DEFAULT_FORM_STATE);
    setSelectedRole(null);
  }, [setSelectedRole]);

  /**
   * Handle form input changes
   */
  const handleInputChange = useCallback(
    (field: keyof RoleFormState, value: string | boolean) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <Box id="identity-roles-wrapper" className="card" p={4}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          {t('AbpIdentity::Roles')}
        </Text>
        <Button colorPalette="blue" onClick={handleAdd}>
          {t('AbpIdentity::NewRole')}
        </Button>
      </Flex>

      {/* Search */}
      <Box mb={4}>
        <Input
          placeholder={t('AbpIdentity::Search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="300px"
        />
      </Box>

      {/* Error */}
      {error && (
        <Alert status="error" mb={4}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {isLoading && roles.length === 0 && (
        <Flex justify="center" py={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Table */}
      {roles.length > 0 && (
        <Table.Root variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>{t('AbpIdentity::Actions')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('AbpIdentity::RoleName')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredRoles.map((role) => (
              <Table.Row key={role.id}>
                <Table.Cell>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button size="sm" colorPalette="blue">
                        {t('AbpIdentity::Actions')}
                      </Button>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item value="edit" onClick={() => handleEdit(role.id)}>
                          {t('AbpIdentity::Edit')}
                        </Menu.Item>
                        <Menu.Item value="permissions" onClick={() => handleOpenPermissions(role.name)}>
                          {t('AbpIdentity::Permissions')}
                        </Menu.Item>
                        {!role.isStatic && (
                          <Menu.Item
                            value="delete"
                            color="red.500"
                            onClick={() => handleDelete(role.id, role.name)}
                          >
                            {t('AbpIdentity::Delete')}
                          </Menu.Item>
                        )}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Table.Cell>
                <Table.Cell>{role.name}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {/* Empty state */}
      {!isLoading && roles.length === 0 && (
        <Text textAlign="center" color="gray.500" py={8}>
          {t('AbpIdentity::NoRolesFound')}
        </Text>
      )}

      {/* Role Modal */}
      <Modal
        visible={isModalOpen}
        onVisibleChange={setIsModalOpen}
        header={selectedRole?.id ? t('AbpIdentity::Edit') : t('AbpIdentity::NewRole')}
        footer={
          <>
            <Button variant="outline" onClick={handleModalClose} disabled={isSubmitting}>
              {t('AbpIdentity::Cancel')}
            </Button>
            <Button
              colorPalette="blue"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!formState.name.trim()}
            >
              {t('AbpIdentity::Save')}
            </Button>
          </>
        }
      >
        <VStack gap={4} align="stretch">
          <FormField label={t('AbpIdentity::RoleName')} required>
            <Input
              value={formState.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              maxLength={256}
              placeholder={t('AbpIdentity::RoleName')}
            />
          </FormField>

          <Checkbox
            checked={formState.isDefault}
            onChange={(e) => handleInputChange('isDefault', e.target.checked)}
          >
            {t('AbpIdentity::DisplayName:IsDefault')}
          </Checkbox>

          <Checkbox
            checked={formState.isPublic}
            onChange={(e) => handleInputChange('isPublic', e.target.checked)}
          >
            {t('AbpIdentity::DisplayName:IsPublic')}
          </Checkbox>
        </VStack>
      </Modal>

      {/* Permission Management Modal */}
      <PermissionManagementModal
        visible={isPermissionModalOpen}
        onVisibleChange={setIsPermissionModalOpen}
        providerName="R"
        providerKey={permissionProviderKey}
      />
    </Box>
  );
}

export default RolesComponent;

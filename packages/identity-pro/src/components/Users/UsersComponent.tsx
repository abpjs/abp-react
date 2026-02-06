import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocalization, ABP } from '@abpjs/core';
import { Modal, useConfirmation, Confirmation, Alert, Button, Checkbox, FormField } from '@abpjs/theme-shared';
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
  Tabs,
  SimpleGrid,
} from '@chakra-ui/react';
import { useUsers, useRoles } from '../../hooks';
import type { Identity } from '../../models';

/**
 * Props for UsersComponent
 */
export interface UsersComponentProps {
  /** Optional callback when a user is created */
  onUserCreated?: (user: Identity.UserItem) => void;
  /** Optional callback when a user is updated */
  onUserUpdated?: (user: Identity.UserItem) => void;
  /** Optional callback when a user is deleted */
  onUserDeleted?: (id: string) => void;
}

/**
 * Form state for user modal
 */
interface UserFormState {
  userName: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  password: string;
  lockoutEnabled: boolean;
  twoFactorEnabled: boolean;
  roleNames: string[];
}

const DEFAULT_FORM_STATE: UserFormState = {
  userName: '',
  name: '',
  surname: '',
  email: '',
  phoneNumber: '',
  password: '',
  lockoutEnabled: true,
  twoFactorEnabled: true,
  roleNames: [],
};

/**
 * UsersComponent - Component for managing users
 *
 * This is the React equivalent of Angular's UsersComponent.
 * It displays a table of users with CRUD operations, role assignment, and permission management.
 *
 * @example
 * ```tsx
 * function IdentityPage() {
 *   return (
 *     <UsersComponent
 *       onUserCreated={(user) => console.log('User created:', user)}
 *       onUserDeleted={(id) => console.log('User deleted:', id)}
 *     />
 *   );
 * }
 * ```
 */
export function UsersComponent({
  onUserCreated,
  onUserUpdated,
  onUserDeleted,
}: UsersComponentProps): React.ReactElement {
  const { t } = useLocalization();
  const confirmation = useConfirmation();

  const {
    users,
    totalCount,
    selectedUser,
    selectedUserRoles,
    isLoading,
    error,
    pageQuery,
    fetchUsers,
    getUserById,
    getUserRoles,
    createUser,
    updateUser,
    deleteUser,
    setSelectedUser,
    setPageQuery,
  } = useUsers();

  const { roles, fetchRoles } = useRoles();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<UserFormState>(DEFAULT_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Permission modal state
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionProviderKey, setPermissionProviderKey] = useState('');

  // Search state (debounced)
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Fetch roles and users on mount
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [fetchRoles, fetchUsers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users when search term changes
  useEffect(() => {
    const newQuery: ABP.PageQueryParams = {
      ...pageQuery,
      filter: debouncedSearchTerm || undefined,
      skipCount: 0,
    };
    setPageQuery(newQuery);
    fetchUsers(newQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only trigger on search term change, not on pageQuery/fetchUsers changes
  }, [debouncedSearchTerm]);

  // Get selected role names for form
  const selectedRoleNames = useMemo(() => {
    return selectedUserRoles.map((role) => role.name);
  }, [selectedUserRoles]);

  /**
   * Handle add new user
   */
  const handleAdd = useCallback(() => {
    setSelectedUser(null);
    setFormState(DEFAULT_FORM_STATE);
    setIsModalOpen(true);
  }, [setSelectedUser]);

  /**
   * Handle edit user
   */
  const handleEdit = useCallback(
    async (id: string) => {
      await Promise.all([getUserById(id), getUserRoles(id)]);
      setIsModalOpen(true);
    },
    [getUserById, getUserRoles]
  );

  // Update form when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      setFormState({
        userName: selectedUser.userName || '',
        name: selectedUser.name || '',
        surname: selectedUser.surname || '',
        email: selectedUser.email || '',
        phoneNumber: selectedUser.phoneNumber || '',
        password: '',
        lockoutEnabled: selectedUser.lockoutEnabled ?? true,
        twoFactorEnabled: selectedUser.twoFactorEnabled ?? true,
        roleNames: selectedRoleNames,
      });
    }
  }, [selectedUser, selectedRoleNames]);

  /**
   * Handle delete user
   */
  const handleDelete = useCallback(
    async (id: string, userName: string) => {
      const status = await confirmation.warn(
        t('AbpIdentity::UserDeletionConfirmationMessage', userName),
        t('AbpIdentity::AreYouSure')
      );

      if (status === Confirmation.Status.confirm) {
        const result = await deleteUser(id);
        if (result.success) {
          onUserDeleted?.(id);
        }
      }
    },
    [confirmation, t, deleteUser, onUserDeleted]
  );

  /**
   * Handle open permissions modal
   */
  const handleOpenPermissions = useCallback((userId: string) => {
    setPermissionProviderKey(userId);
    setIsPermissionModalOpen(true);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!formState.userName.trim() || !formState.email.trim()) return;
    if (!selectedUser?.id && !formState.password) return; // Password required for new users

    setIsSubmitting(true);

    const userData: Identity.UserSaveRequest = {
      userName: formState.userName.trim(),
      name: formState.name.trim(),
      surname: formState.surname.trim(),
      email: formState.email.trim(),
      phoneNumber: formState.phoneNumber.trim(),
      password: formState.password,
      lockoutEnabled: formState.lockoutEnabled,
      twoFactorEnabled: formState.twoFactorEnabled,
      roleNames: formState.roleNames,
      organizationUnitIds: [], // v2.9.0: Organization unit assignment (can be extended with UI)
    };

    let result;
    if (selectedUser?.id) {
      result = await updateUser(selectedUser.id, userData);
      if (result.success) {
        onUserUpdated?.({
          ...selectedUser,
          ...userData,
        } as Identity.UserItem);
      }
    } else {
      result = await createUser(userData);
      if (result.success) {
        onUserCreated?.({
          ...userData,
          id: '',
          tenantId: '',
          emailConfirmed: false,
          phoneNumberConfirmed: false,
          isLockedOut: false,
          concurrencyStamp: '',
        } as Identity.UserItem);
      }
    }

    setIsSubmitting(false);

    if (result.success) {
      setIsModalOpen(false);
      setFormState(DEFAULT_FORM_STATE);
      setSelectedUser(null);
    }
  }, [formState, selectedUser, updateUser, createUser, onUserCreated, onUserUpdated, setSelectedUser]);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setFormState(DEFAULT_FORM_STATE);
    setSelectedUser(null);
  }, [setSelectedUser]);

  /**
   * Handle form input changes
   */
  const handleInputChange = useCallback(
    (field: keyof UserFormState, value: string | boolean | string[]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  /**
   * Handle role checkbox change
   */
  const handleRoleChange = useCallback((roleName: string, checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      roleNames: checked
        ? [...prev.roleNames, roleName]
        : prev.roleNames.filter((name) => name !== roleName),
    }));
  }, []);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback(
    (newSkipCount: number) => {
      const newQuery = { ...pageQuery, skipCount: newSkipCount };
      setPageQuery(newQuery);
      fetchUsers(newQuery);
    },
    [pageQuery, setPageQuery, fetchUsers]
  );

  return (
    <Box id="identity-users-wrapper" className="card" p={4}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          {t('AbpIdentity::Users')}
        </Text>
        <Button colorPalette="blue" onClick={handleAdd}>
          {t('AbpIdentity::NewUser')}
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
      {isLoading && users.length === 0 && (
        <Flex justify="center" py={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Table */}
      {users.length > 0 && (
        <>
          <Table.Root variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>{t('AbpIdentity::Actions')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('AbpIdentity::UserName')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('AbpIdentity::EmailAddress')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('AbpIdentity::PhoneNumber')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <Button size="sm" colorPalette="blue">
                          {t('AbpIdentity::Actions')}
                        </Button>
                      </Menu.Trigger>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item value="edit" onClick={() => handleEdit(user.id)}>
                            {t('AbpIdentity::Edit')}
                          </Menu.Item>
                          <Menu.Item value="permissions" onClick={() => handleOpenPermissions(user.id)}>
                            {t('AbpIdentity::Permissions')}
                          </Menu.Item>
                          <Menu.Item
                            value="delete"
                            color="red.500"
                            onClick={() => handleDelete(user.id, user.userName)}
                          >
                            {t('AbpIdentity::Delete')}
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Menu.Root>
                  </Table.Cell>
                  <Table.Cell>{user.userName}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.phoneNumber}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination info */}
          <Flex justify="space-between" align="center" mt={4}>
            <Text color="gray.600">
              {t('AbpIdentity::TotalCount')}: {totalCount}
            </Text>
            <Flex gap={2}>
              <Button
                size="sm"
                disabled={(pageQuery.skipCount || 0) === 0}
                onClick={() =>
                  handlePageChange(
                    Math.max(0, (pageQuery.skipCount || 0) - (pageQuery.maxResultCount || 10))
                  )
                }
              >
                {t('AbpIdentity::Previous')}
              </Button>
              <Button
                size="sm"
                disabled={
                  (pageQuery.skipCount || 0) + (pageQuery.maxResultCount || 10) >= totalCount
                }
                onClick={() =>
                  handlePageChange((pageQuery.skipCount || 0) + (pageQuery.maxResultCount || 10))
                }
              >
                {t('AbpIdentity::Next')}
              </Button>
            </Flex>
          </Flex>
        </>
      )}

      {/* Empty state */}
      {!isLoading && users.length === 0 && (
        <Text textAlign="center" color="gray.500" py={8}>
          {t('AbpIdentity::NoUsersFound')}
        </Text>
      )}

      {/* User Modal */}
      <Modal
        visible={isModalOpen}
        onVisibleChange={setIsModalOpen}
        size="lg"
        header={selectedUser?.id ? t('AbpIdentity::Edit') : t('AbpIdentity::NewUser')}
        footer={
          <>
            <Button variant="outline" onClick={handleModalClose} disabled={isSubmitting}>
              {t('AbpIdentity::Cancel')}
            </Button>
            <Button
              colorPalette="blue"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!formState.userName.trim() || !formState.email.trim() || (!selectedUser?.id && !formState.password)}
            >
              {t('AbpIdentity::Save')}
            </Button>
          </>
        }
      >
        <Tabs.Root defaultValue="info">
          <Tabs.List>
            <Tabs.Trigger value="info">{t('AbpIdentity::UserInformations')}</Tabs.Trigger>
            <Tabs.Trigger value="roles">{t('AbpIdentity::Roles')}</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="info">
            <VStack gap={4} align="stretch" pt={4}>
              <FormField label={t('AbpIdentity::UserName')} required>
                <Input
                  value={formState.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  maxLength={256}
                />
              </FormField>

              <SimpleGrid columns={2} gap={4}>
                <FormField label={t('AbpIdentity::Name')}>
                  <Input
                    value={formState.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    maxLength={64}
                  />
                </FormField>

                <FormField label={t('AbpIdentity::DisplayName:Surname')}>
                  <Input
                    value={formState.surname}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                    maxLength={64}
                  />
                </FormField>
              </SimpleGrid>

              <FormField label={t('AbpIdentity::Password')} required={!selectedUser?.id}>
                <Input
                  type="password"
                  value={formState.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  autoComplete="new-password"
                  maxLength={32}
                  placeholder={selectedUser?.id ? t('AbpIdentity::LeaveBlankToKeepCurrent') : ''}
                />
              </FormField>

              <FormField label={t('AbpIdentity::EmailAddress')} required>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  maxLength={256}
                />
              </FormField>

              <FormField label={t('AbpIdentity::PhoneNumber')}>
                <Input
                  value={formState.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  maxLength={16}
                />
              </FormField>

              <Checkbox
                checked={formState.lockoutEnabled}
                onChange={(e) => handleInputChange('lockoutEnabled', e.target.checked)}
              >
                {t('AbpIdentity::DisplayName:LockoutEnabled')}
              </Checkbox>

              <Checkbox
                checked={formState.twoFactorEnabled}
                onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
              >
                {t('AbpIdentity::DisplayName:TwoFactorEnabled')}
              </Checkbox>
            </VStack>
          </Tabs.Content>

          <Tabs.Content value="roles">
            <VStack gap={2} align="stretch" pt={4}>
              {roles.map((role) => (
                <Checkbox
                  key={role.id}
                  checked={formState.roleNames.includes(role.name)}
                  onChange={(e) => handleRoleChange(role.name, e.target.checked)}
                >
                  {role.name}
                </Checkbox>
              ))}
              {roles.length === 0 && (
                <Text color="gray.500">{t('AbpIdentity::NoRolesFound')}</Text>
              )}
            </VStack>
          </Tabs.Content>
        </Tabs.Root>
      </Modal>

      {/* Permission Management Modal */}
      <PermissionManagementModal
        visible={isPermissionModalOpen}
        onVisibleChange={setIsPermissionModalOpen}
        providerName="U"
        providerKey={permissionProviderKey}
      />
    </Box>
  );
}

export default UsersComponent;

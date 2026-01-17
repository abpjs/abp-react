import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocalization, ABP } from '@abpjs/core';
import { Modal, useConfirmation, Toaster } from '@abpjs/theme-shared';
import { PermissionManagementModal } from '@abpjs/permission-management';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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

      if (status === Toaster.Status.confirm) {
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
        <Button colorScheme="blue" onClick={handleAdd}>
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
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
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
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>{t('AbpIdentity::Actions')}</Th>
                <Th>{t('AbpIdentity::UserName')}</Th>
                <Th>{t('AbpIdentity::EmailAddress')}</Th>
                <Th>{t('AbpIdentity::PhoneNumber')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <Menu>
                      <MenuButton as={Button} size="sm" colorScheme="blue">
                        {t('AbpIdentity::Actions')}
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => handleEdit(user.id)}>
                          {t('AbpIdentity::Edit')}
                        </MenuItem>
                        <MenuItem onClick={() => handleOpenPermissions(user.id)}>
                          {t('AbpIdentity::Permissions')}
                        </MenuItem>
                        <MenuItem
                          color="red.500"
                          onClick={() => handleDelete(user.id, user.userName)}
                        >
                          {t('AbpIdentity::Delete')}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                  <Td>{user.userName}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.phoneNumber}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Pagination info */}
          <Flex justify="space-between" align="center" mt={4}>
            <Text color="gray.600">
              {t('AbpIdentity::TotalCount')}: {totalCount}
            </Text>
            <Flex gap={2}>
              <Button
                size="sm"
                isDisabled={(pageQuery.skipCount || 0) === 0}
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
                isDisabled={
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
            <Button variant="outline" onClick={handleModalClose} isDisabled={isSubmitting}>
              {t('AbpIdentity::Cancel')}
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={!formState.userName.trim() || !formState.email.trim() || (!selectedUser?.id && !formState.password)}
            >
              {t('AbpIdentity::Save')}
            </Button>
          </>
        }
      >
        <Tabs>
          <TabList>
            <Tab>{t('AbpIdentity::UserInformations')}</Tab>
            <Tab>{t('AbpIdentity::Roles')}</Tab>
          </TabList>

          <TabPanels>
            {/* User Information Tab */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>{t('AbpIdentity::UserName')}</FormLabel>
                  <Input
                    value={formState.userName}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    maxLength={256}
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>{t('AbpIdentity::Name')}</FormLabel>
                    <Input
                      value={formState.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      maxLength={64}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>{t('AbpIdentity::DisplayName:Surname')}</FormLabel>
                    <Input
                      value={formState.surname}
                      onChange={(e) => handleInputChange('surname', e.target.value)}
                      maxLength={64}
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired={!selectedUser?.id}>
                  <FormLabel>{t('AbpIdentity::Password')}</FormLabel>
                  <Input
                    type="password"
                    value={formState.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    autoComplete="new-password"
                    maxLength={32}
                    placeholder={selectedUser?.id ? t('AbpIdentity::LeaveBlankToKeepCurrent') : ''}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('AbpIdentity::EmailAddress')}</FormLabel>
                  <Input
                    type="email"
                    value={formState.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    maxLength={256}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('AbpIdentity::PhoneNumber')}</FormLabel>
                  <Input
                    value={formState.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    maxLength={16}
                  />
                </FormControl>

                <Checkbox
                  isChecked={formState.lockoutEnabled}
                  onChange={(e) => handleInputChange('lockoutEnabled', e.target.checked)}
                >
                  {t('AbpIdentity::DisplayName:LockoutEnabled')}
                </Checkbox>

                <Checkbox
                  isChecked={formState.twoFactorEnabled}
                  onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
                >
                  {t('AbpIdentity::DisplayName:TwoFactorEnabled')}
                </Checkbox>
              </VStack>
            </TabPanel>

            {/* Roles Tab */}
            <TabPanel>
              <VStack spacing={2} align="stretch">
                {roles.map((role) => (
                  <Checkbox
                    key={role.id}
                    isChecked={formState.roleNames.includes(role.name)}
                    onChange={(e) => handleRoleChange(role.name, e.target.checked)}
                  >
                    {role.name}
                  </Checkbox>
                ))}
                {roles.length === 0 && (
                  <Text color="gray.500">{t('AbpIdentity::NoRolesFound')}</Text>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
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

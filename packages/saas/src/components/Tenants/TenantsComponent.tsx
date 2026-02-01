/**
 * TenantsComponent
 * Translated from @volo/abp.ng.saas v0.7.2
 *
 * Component for managing tenants in a multi-tenant SaaS application.
 */

import { useEffect, useState, useCallback } from 'react';
import { useLocalization } from '@abpjs/core';
import { Modal, Button, FormField, useConfirmation, Toaster } from '@abpjs/theme-shared';
import {
  Box,
  Flex,
  Input,
  Table,
  Spinner,
  VStack,
  Text,
  Badge,
} from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { useTenants, useEditions } from '../../hooks';
import type { Saas } from '../../models';

/**
 * Props for TenantsComponent
 * @since 0.7.2
 */
export interface TenantsComponentProps {
  /** Callback when a tenant is created */
  onTenantCreated?: (tenant: Saas.Tenant) => void;
  /** Callback when a tenant is updated */
  onTenantUpdated?: (tenant: Saas.Tenant) => void;
  /** Callback when a tenant is deleted */
  onTenantDeleted?: (id: string) => void;
}

/**
 * Modal type for the component
 */
type ModalType = 'tenant' | 'connectionString' | null;

/**
 * TenantsComponent - Component for managing tenants
 *
 * Features:
 * - List tenants with pagination
 * - Create, edit, and delete tenants
 * - Manage connection strings
 * - Manage features per tenant
 *
 * @since 0.7.2
 */
export function TenantsComponent({
  onTenantCreated,
  onTenantUpdated,
  onTenantDeleted,
}: TenantsComponentProps) {
  const { t } = useLocalization();
  const { warn } = useConfirmation();

  const {
    tenants,
    totalCount,
    selectedTenant,
    isLoading,
    error,
    fetchTenants,
    getTenantById,
    createTenant,
    updateTenant,
    deleteTenant,
    getDefaultConnectionString,
    updateDefaultConnectionString,
    deleteDefaultConnectionString,
    setSelectedTenant,
  } = useTenants();

  const { editions, fetchEditions } = useEditions();

  // Local state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalBusy, setModalBusy] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [filter, setFilter] = useState('');

  // Form state for tenant
  const [tenantName, setTenantName] = useState('');
  const [tenantEditionId, setTenantEditionId] = useState('');
  const [adminEmailAddress, setAdminEmailAddress] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Form state for connection string
  const [connStringUseShared, setConnStringUseShared] = useState(true);
  const [connString, setConnString] = useState('');

  // Fetch tenants on mount and when page/filter changes
  useEffect(() => {
    fetchTenants({
      skipCount: page * pageSize,
      maxResultCount: pageSize,
      filter: filter || undefined,
      getEditionNames: true,
    });
  }, [page, pageSize, fetchTenants]);

  // Fetch editions on mount for the dropdown
  useEffect(() => {
    fetchEditions();
  }, [fetchEditions]);

  // Handle search
  const handleSearch = useCallback(() => {
    setPage(0);
    fetchTenants({
      skipCount: 0,
      maxResultCount: pageSize,
      filter: filter || undefined,
      getEditionNames: true,
    });
  }, [filter, pageSize, fetchTenants]);

  // Open add tenant modal
  const handleAddTenant = useCallback(() => {
    setSelectedTenant(null);
    setTenantName('');
    setTenantEditionId('');
    setAdminEmailAddress('');
    setAdminPassword('');
    setModalType('tenant');
    setModalVisible(true);
  }, [setSelectedTenant]);

  // Open edit tenant modal
  const handleEditTenant = useCallback(
    async (id: string) => {
      const result = await getTenantById(id);
      if (result.success && result.data) {
        setTenantName(result.data.name);
        setTenantEditionId(result.data.editionId || '');
        setModalType('tenant');
        setModalVisible(true);
      }
    },
    [getTenantById]
  );

  // Open connection string modal
  const handleEditConnectionString = useCallback(
    async (id: string) => {
      const tenantResult = await getTenantById(id);
      if (tenantResult.success) {
        const connResult = await getDefaultConnectionString(id);
        setConnStringUseShared(!connResult.data);
        setConnString(connResult.data || '');
        setModalType('connectionString');
        setModalVisible(true);
      }
    },
    [getTenantById, getDefaultConnectionString]
  );

  // Handle delete tenant
  const handleDeleteTenant = useCallback(
    async (tenant: Saas.Tenant) => {
      const status = await warn(
        t('Saas::TenantDeletionConfirmationMessage').replace('{0}', tenant.name),
        t('Saas::AreYouSure')
      );

      if (status === Toaster.Status.confirm) {
        const result = await deleteTenant(tenant.id);
        if (result.success) {
          onTenantDeleted?.(tenant.id);
          fetchTenants({
            skipCount: page * pageSize,
            maxResultCount: pageSize,
            filter: filter || undefined,
            getEditionNames: true,
          });
        }
      }
    },
    [warn, t, deleteTenant, onTenantDeleted, fetchTenants, page, pageSize, filter]
  );

  // Save tenant (create or update)
  const handleSaveTenant = useCallback(async () => {
    if (!tenantName.trim()) return;

    setModalBusy(true);

    try {
      if (selectedTenant?.id) {
        // Update
        const result = await updateTenant({
          id: selectedTenant.id,
          name: tenantName,
          editionId: tenantEditionId || undefined,
          concurrencyStamp: selectedTenant.concurrencyStamp,
        });
        if (result.success && result.data) {
          onTenantUpdated?.(result.data);
          setModalVisible(false);
          fetchTenants({
            skipCount: page * pageSize,
            maxResultCount: pageSize,
            filter: filter || undefined,
            getEditionNames: true,
          });
        }
      } else {
        // Create
        const result = await createTenant({
          adminEmailAddress,
          adminPassword,
          name: tenantName,
          editionId: tenantEditionId || undefined,
        });
        if (result.success && result.data) {
          onTenantCreated?.(result.data);
          setModalVisible(false);
          fetchTenants({
            skipCount: page * pageSize,
            maxResultCount: pageSize,
            filter: filter || undefined,
            getEditionNames: true,
          });
        }
      }
    } finally {
      setModalBusy(false);
    }
  }, [
    tenantName,
    tenantEditionId,
    adminEmailAddress,
    adminPassword,
    selectedTenant,
    updateTenant,
    createTenant,
    onTenantUpdated,
    onTenantCreated,
    fetchTenants,
    page,
    pageSize,
    filter,
  ]);

  // Save connection string
  const handleSaveConnectionString = useCallback(async () => {
    if (!selectedTenant?.id) return;

    setModalBusy(true);

    try {
      if (connStringUseShared || !connString.trim()) {
        await deleteDefaultConnectionString(selectedTenant.id);
      } else {
        await updateDefaultConnectionString({
          id: selectedTenant.id,
          defaultConnectionString: connString,
        });
      }
      setModalVisible(false);
    } finally {
      setModalBusy(false);
    }
  }, [
    selectedTenant,
    connStringUseShared,
    connString,
    deleteDefaultConnectionString,
    updateDefaultConnectionString,
  ]);

  // Handle save based on modal type
  const handleSave = useCallback(() => {
    if (modalType === 'tenant') {
      handleSaveTenant();
    } else if (modalType === 'connectionString') {
      handleSaveConnectionString();
    }
  }, [modalType, handleSaveTenant, handleSaveConnectionString]);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setModalType(null);
    setSelectedTenant(null);
  }, [setSelectedTenant]);

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);

  // Get modal title
  const getModalTitle = () => {
    if (modalType === 'connectionString') {
      return t('Saas::ConnectionStrings');
    }
    return selectedTenant?.id ? t('Saas::Edit') : t('Saas::NewTenant');
  };

  return (
    <Box id="saas-tenants-wrapper" className="card">
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          {t('Saas::Tenants')}
        </Text>
        <Button colorPalette="blue" onClick={handleAddTenant}>
          {t('Saas::NewTenant')}
        </Button>
      </Flex>

      {/* Search */}
      <Flex gap={2} mb={4}>
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('AbpUi::PagerSearch')}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>{t('AbpUi::Search')}</Button>
      </Flex>

      {/* Error */}
      {error && (
        <Box mb={4} p={3} bg="red.100" borderRadius="md">
          <Text color="red.800">{error}</Text>
        </Box>
      )}

      {/* Loading */}
      {isLoading && tenants.length === 0 && (
        <Flex justifyContent="center" p={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Empty state */}
      {!isLoading && tenants.length === 0 ? (
        <Text textAlign="center" p={8} color="gray.500">
          {t('Saas::NoTenantsFound')}
        </Text>
      ) : (
        <Box borderWidth="1px" borderRadius="md" overflow="hidden">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>{t('Saas::Actions')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('Saas::TenantName')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('Saas::EditionName')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tenants.map((tenant) => (
                <Table.Row key={tenant.id}>
                  <Table.Cell>
                    <Flex gap={1}>
                      <Button
                        size="sm"
                        colorPalette="blue"
                        variant="outline"
                        onClick={() => handleEditTenant(tenant.id)}
                      >
                        {t('Saas::Edit')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditConnectionString(tenant.id)}
                      >
                        {t('Saas::ConnectionStrings')}
                      </Button>
                      <Button
                        size="sm"
                        colorPalette="red"
                        variant="outline"
                        onClick={() => handleDeleteTenant(tenant)}
                      >
                        {t('Saas::Delete')}
                      </Button>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="medium">{tenant.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    {tenant.editionName ? (
                      <Badge colorPalette="blue">{tenant.editionName}</Badge>
                    ) : (
                      <Text color="gray.500">-</Text>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination */}
          {totalCount > pageSize && (
            <Flex justifyContent="space-between" alignItems="center" p={4} borderTopWidth="1px">
              <Text fontSize="sm">
                {`${page * pageSize + 1} - ${Math.min((page + 1) * pageSize, totalCount)} / ${totalCount}`}
              </Text>
              <Flex gap={2}>
                <Button
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  {t('AbpUi::Previous')}
                </Button>
                <Button
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t('AbpUi::Next')}
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        header={getModalTitle()}
        footer={
          <Flex gap={2}>
            <Button variant="outline" onClick={handleCloseModal}>
              {t('Saas::Cancel')}
            </Button>
            <Button colorPalette="blue" onClick={handleSave} loading={modalBusy}>
              {t('AbpIdentity::Save')}
            </Button>
          </Flex>
        }
      >
        {modalType === 'tenant' && (
          <VStack gap={4} align="stretch">
            <FormField label={t('Saas::TenantName')} required>
              <Input
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder={t('Saas::TenantName')}
                autoFocus
              />
            </FormField>
            {editions.length > 0 && (
              <FormField label={t('Saas::Edition')}>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={tenantEditionId}
                    onChange={(e) => setTenantEditionId(e.target.value)}
                  >
                    <option value="">{t('Saas::SelectEdition')}</option>
                    {editions.map((edition) => (
                      <option key={edition.id} value={edition.id}>
                        {edition.displayName}
                      </option>
                    ))}
                  </NativeSelectField>
                </NativeSelectRoot>
              </FormField>
            )}
            {/* Admin credentials only shown when creating new tenant */}
            {!selectedTenant && (
              <>
                <FormField label={t('Saas::AdminEmailAddress')} required>
                  <Input
                    type="email"
                    value={adminEmailAddress}
                    onChange={(e) => setAdminEmailAddress(e.target.value)}
                    placeholder={t('Saas::AdminEmailAddress')}
                  />
                </FormField>
                <FormField label={t('Saas::AdminPassword')} required>
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder={t('Saas::AdminPassword')}
                  />
                </FormField>
              </>
            )}
          </VStack>
        )}

        {modalType === 'connectionString' && (
          <VStack gap={4} align="stretch">
            <Flex alignItems="center" gap={2}>
              <input
                type="checkbox"
                id="useSharedDatabase"
                checked={connStringUseShared}
                onChange={(e) => setConnStringUseShared(e.target.checked)}
              />
              <label htmlFor="useSharedDatabase">
                {t('Saas::DisplayName:UseSharedDatabase')}
              </label>
            </Flex>
            {!connStringUseShared && (
              <FormField label={t('Saas::DisplayName:DefaultConnectionString')}>
                <Input
                  value={connString}
                  onChange={(e) => setConnString(e.target.value)}
                  placeholder={t('Saas::DisplayName:DefaultConnectionString')}
                />
              </FormField>
            )}
          </VStack>
        )}
      </Modal>
    </Box>
  );
}

export default TenantsComponent;

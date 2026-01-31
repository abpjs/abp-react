/**
 * EditionsComponent
 * Translated from @volo/abp.ng.saas v0.7.2
 *
 * Component for managing editions in a multi-tenant SaaS application.
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
} from '@chakra-ui/react';
import { useEditions } from '../../hooks';
import type { Saas } from '../../models';

/**
 * Props for EditionsComponent
 * @since 0.7.2
 */
export interface EditionsComponentProps {
  /** Callback when an edition is created */
  onEditionCreated?: (edition: Saas.Edition) => void;
  /** Callback when an edition is updated */
  onEditionUpdated?: (edition: Saas.Edition) => void;
  /** Callback when an edition is deleted */
  onEditionDeleted?: (id: string) => void;
  /** Callback when features button is clicked */
  onManageFeatures?: (editionId: string) => void;
}

/**
 * EditionsComponent - Component for managing editions
 *
 * Features:
 * - List editions with pagination
 * - Create, edit, and delete editions
 * - Manage features per edition
 *
 * @since 0.7.2
 */
export function EditionsComponent({
  onEditionCreated,
  onEditionUpdated,
  onEditionDeleted,
  onManageFeatures,
}: EditionsComponentProps) {
  const { t } = useLocalization();
  const { warn } = useConfirmation();

  const {
    editions,
    totalCount,
    selectedEdition,
    isLoading,
    error,
    fetchEditions,
    getEditionById,
    createEdition,
    updateEdition,
    deleteEdition,
    setSelectedEdition,
  } = useEditions();

  // Local state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalBusy, setModalBusy] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [filter, setFilter] = useState('');

  // Form state
  const [displayName, setDisplayName] = useState('');

  // Fetch editions on mount and when page/filter changes
  useEffect(() => {
    fetchEditions({
      skipCount: page * pageSize,
      maxResultCount: pageSize,
      filter: filter || undefined,
    });
  }, [page, pageSize, fetchEditions]);

  // Handle search
  const handleSearch = useCallback(() => {
    setPage(0);
    fetchEditions({
      skipCount: 0,
      maxResultCount: pageSize,
      filter: filter || undefined,
    });
  }, [filter, pageSize, fetchEditions]);

  // Open add edition modal
  const handleAddEdition = useCallback(() => {
    setSelectedEdition(null);
    setDisplayName('');
    setModalVisible(true);
  }, [setSelectedEdition]);

  // Open edit edition modal
  const handleEditEdition = useCallback(
    async (id: string) => {
      const result = await getEditionById(id);
      if (result.success && result.data) {
        setDisplayName(result.data.displayName);
        setModalVisible(true);
      }
    },
    [getEditionById]
  );

  // Handle delete edition
  const handleDeleteEdition = useCallback(
    async (edition: Saas.Edition) => {
      const status = await warn(
        t('Saas::EditionDeletionConfirmationMessage').replace('{0}', edition.displayName),
        t('Saas::AreYouSure')
      );

      if (status === Toaster.Status.confirm) {
        const result = await deleteEdition(edition.id);
        if (result.success) {
          onEditionDeleted?.(edition.id);
          fetchEditions({
            skipCount: page * pageSize,
            maxResultCount: pageSize,
            filter: filter || undefined,
          });
        }
      }
    },
    [warn, t, deleteEdition, onEditionDeleted, fetchEditions, page, pageSize, filter]
  );

  // Handle manage features
  const handleManageFeatures = useCallback(
    (editionId: string) => {
      onManageFeatures?.(editionId);
    },
    [onManageFeatures]
  );

  // Save edition (create or update)
  const handleSave = useCallback(async () => {
    if (!displayName.trim()) return;

    setModalBusy(true);

    try {
      if (selectedEdition?.id) {
        // Update
        const result = await updateEdition({
          id: selectedEdition.id,
          displayName,
          concurrencyStamp: selectedEdition.concurrencyStamp,
        });
        if (result.success && result.data) {
          onEditionUpdated?.(result.data);
          setModalVisible(false);
          fetchEditions({
            skipCount: page * pageSize,
            maxResultCount: pageSize,
            filter: filter || undefined,
          });
        }
      } else {
        // Create
        const result = await createEdition({
          displayName,
        });
        if (result.success && result.data) {
          onEditionCreated?.(result.data);
          setModalVisible(false);
          fetchEditions({
            skipCount: page * pageSize,
            maxResultCount: pageSize,
            filter: filter || undefined,
          });
        }
      }
    } finally {
      setModalBusy(false);
    }
  }, [
    displayName,
    selectedEdition,
    updateEdition,
    createEdition,
    onEditionUpdated,
    onEditionCreated,
    fetchEditions,
    page,
    pageSize,
    filter,
  ]);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedEdition(null);
  }, [setSelectedEdition]);

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box id="saas-editions-wrapper" className="card">
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          {t('Saas::Editions')}
        </Text>
        <Button colorPalette="blue" onClick={handleAddEdition}>
          {t('Saas::NewEdition')}
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
      {isLoading && editions.length === 0 && (
        <Flex justifyContent="center" p={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Empty state */}
      {!isLoading && editions.length === 0 ? (
        <Text textAlign="center" p={8} color="gray.500">
          {t('Saas::NoEditionsFound')}
        </Text>
      ) : (
        <Box borderWidth="1px" borderRadius="md" overflow="hidden">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>{t('Saas::Actions')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('Saas::EditionName')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {editions.map((edition) => (
                <Table.Row key={edition.id}>
                  <Table.Cell>
                    <Flex gap={1}>
                      <Button
                        size="sm"
                        colorPalette="blue"
                        variant="outline"
                        onClick={() => handleEditEdition(edition.id)}
                      >
                        {t('Saas::Edit')}
                      </Button>
                      {onManageFeatures && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleManageFeatures(edition.id)}
                        >
                          {t('Saas::Features')}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        colorPalette="red"
                        variant="outline"
                        onClick={() => handleDeleteEdition(edition)}
                      >
                        {t('Saas::Delete')}
                      </Button>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="medium">{edition.displayName}</Text>
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
        header={selectedEdition?.id ? t('Saas::Edit') : t('Saas::NewEdition')}
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
        <VStack gap={4} align="stretch">
          <FormField label={t('Saas::EditionName')} required>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('Saas::EditionName')}
              autoFocus
            />
          </FormField>
        </VStack>
      </Modal>
    </Box>
  );
}

export default EditionsComponent;

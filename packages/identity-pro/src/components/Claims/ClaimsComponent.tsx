import React, { useEffect, useState, useCallback } from 'react';
import { useLocalization } from '@abpjs/core';
import { Modal, useConfirmation, Confirmation, Alert, Button, FormField } from '@abpjs/theme-shared';
import {
  Box,
  Flex,
  Input,
  Table,
  Spinner,
  VStack,
  Menu,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { useClaims } from '../../hooks';
import type { Identity } from '../../models';

/**
 * Props for ClaimsComponent
 * @since 0.7.2
 */
export interface ClaimsComponentProps {
  /** Optional callback when a claim type is created */
  onClaimTypeCreated?: (claimType: Identity.ClaimType) => void;
  /** Optional callback when a claim type is updated */
  onClaimTypeUpdated?: (claimType: Identity.ClaimType) => void;
  /** Optional callback when a claim type is deleted */
  onClaimTypeDeleted?: (id: string) => void;
}

/**
 * Form state for claim type modal
 */
interface ClaimTypeFormState {
  name: string;
  required: boolean;
  regex: string;
  regexDescription: string;
  description: string;
  valueType: number;
}

const DEFAULT_FORM_STATE: ClaimTypeFormState = {
  name: '',
  required: false,
  regex: '',
  regexDescription: '',
  description: '',
  valueType: 0,
};

/**
 * Value type options for claim types
 */
const VALUE_TYPE_OPTIONS = [
  { value: 0, label: 'String' },
  { value: 1, label: 'Int' },
  { value: 2, label: 'Boolean' },
  { value: 3, label: 'DateTime' },
];

/**
 * Get value type name from numeric value
 */
function getValueTypeName(valueType: number): string {
  const option = VALUE_TYPE_OPTIONS.find(opt => opt.value === valueType);
  return option?.label || 'String';
}

/**
 * ClaimsComponent - Component for managing claim types
 *
 * This is the React equivalent of Angular's ClaimsComponent.
 * It displays a table of claim types with CRUD operations.
 *
 * Pro feature since 0.7.2
 *
 * @example
 * ```tsx
 * function IdentityProPage() {
 *   return (
 *     <ClaimsComponent
 *       onClaimTypeCreated={(claim) => console.log('Claim type created:', claim)}
 *       onClaimTypeDeleted={(id) => console.log('Claim type deleted:', id)}
 *     />
 *   );
 * }
 * ```
 */
export function ClaimsComponent({
  onClaimTypeCreated,
  onClaimTypeUpdated,
  onClaimTypeDeleted,
}: ClaimsComponentProps): React.ReactElement {
  const { t } = useLocalization();
  const confirmation = useConfirmation();

  const {
    claimTypes,
    selectedClaimType,
    isLoading,
    error,
    fetchClaimTypes,
    getClaimTypeById,
    createClaimType,
    updateClaimType,
    deleteClaimType,
    setSelectedClaimType,
  } = useClaims();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<ClaimTypeFormState>(DEFAULT_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch claim types on mount
  useEffect(() => {
    fetchClaimTypes();
  }, [fetchClaimTypes]);

  // Filter claim types based on search term
  const filteredClaimTypes = claimTypes.filter(
    (claim) =>
      !searchTerm || claim.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handle add new claim type
   */
  const handleAdd = useCallback(() => {
    setSelectedClaimType(null);
    setFormState(DEFAULT_FORM_STATE);
    setIsModalOpen(true);
  }, [setSelectedClaimType]);

  /**
   * Handle edit claim type
   */
  const handleEdit = useCallback(
    async (id: string) => {
      const result = await getClaimTypeById(id);
      if (result.success && selectedClaimType) {
        setFormState({
          name: selectedClaimType.name || '',
          required: selectedClaimType.required || false,
          regex: selectedClaimType.regex || '',
          regexDescription: selectedClaimType.regexDescription || '',
          description: selectedClaimType.description || '',
          valueType: selectedClaimType.valueType || 0,
        });
        setIsModalOpen(true);
      }
    },
    [getClaimTypeById, selectedClaimType]
  );

  // Update form when selectedClaimType changes
  useEffect(() => {
    if (selectedClaimType) {
      setFormState({
        name: selectedClaimType.name || '',
        required: selectedClaimType.required || false,
        regex: selectedClaimType.regex || '',
        regexDescription: selectedClaimType.regexDescription || '',
        description: selectedClaimType.description || '',
        valueType: selectedClaimType.valueType || 0,
      });
    }
  }, [selectedClaimType]);

  /**
   * Handle delete claim type
   */
  const handleDelete = useCallback(
    async (id: string, name: string) => {
      const status = await confirmation.warn(
        t('AbpIdentity::ClaimTypeDeletionConfirmationMessage', name) ||
          `Are you sure you want to delete the claim type '${name}'?`,
        t('AbpIdentity::AreYouSure')
      );

      if (status === Confirmation.Status.confirm) {
        const result = await deleteClaimType(id);
        if (result.success) {
          onClaimTypeDeleted?.(id);
        }
      }
    },
    [confirmation, t, deleteClaimType, onClaimTypeDeleted]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!formState.name.trim()) return;

    setIsSubmitting(true);

    const claimTypeData: Identity.ClaimType = {
      id: selectedClaimType?.id,
      name: formState.name.trim(),
      required: formState.required,
      isStatic: selectedClaimType?.isStatic || false,
      regex: formState.regex,
      regexDescription: formState.regexDescription,
      description: formState.description,
      valueType: formState.valueType,
    };

    let result;
    if (selectedClaimType?.id) {
      result = await updateClaimType(claimTypeData);
      if (result.success) {
        onClaimTypeUpdated?.(claimTypeData);
      }
    } else {
      result = await createClaimType(claimTypeData);
      if (result.success) {
        onClaimTypeCreated?.(claimTypeData);
      }
    }

    setIsSubmitting(false);

    if (result.success) {
      setIsModalOpen(false);
      setFormState(DEFAULT_FORM_STATE);
      setSelectedClaimType(null);
    }
  }, [formState, selectedClaimType, updateClaimType, createClaimType, onClaimTypeCreated, onClaimTypeUpdated, setSelectedClaimType]);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setFormState(DEFAULT_FORM_STATE);
    setSelectedClaimType(null);
  }, [setSelectedClaimType]);

  /**
   * Handle form input changes
   */
  const handleInputChange = useCallback(
    (field: keyof ClaimTypeFormState, value: string | boolean | number) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <Box id="identity-claims-wrapper" className="card" p={4}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          {t('AbpIdentity::ClaimTypes') || 'Claim Types'}
        </Text>
        <Button colorPalette="blue" onClick={handleAdd}>
          {t('AbpIdentity::NewClaimType') || 'New Claim Type'}
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
      {isLoading && claimTypes.length === 0 && (
        <Flex justify="center" py={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Table */}
      {claimTypes.length > 0 && (
        <Table.Root variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>{t('AbpIdentity::Actions')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('AbpIdentity::ClaimTypeName') || 'Name'}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('AbpIdentity::ValueType') || 'Value Type'}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('AbpIdentity::Description') || 'Description'}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredClaimTypes.map((claimType) => (
              <Table.Row key={claimType.id}>
                <Table.Cell>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button size="sm" colorPalette="blue">
                        {t('AbpIdentity::Actions')}
                      </Button>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item value="edit" onClick={() => handleEdit(claimType.id!)}>
                          {t('AbpIdentity::Edit')}
                        </Menu.Item>
                        {!claimType.isStatic && (
                          <Menu.Item
                            value="delete"
                            color="red.500"
                            onClick={() => handleDelete(claimType.id!, claimType.name)}
                          >
                            {t('AbpIdentity::Delete')}
                          </Menu.Item>
                        )}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Table.Cell>
                <Table.Cell>{claimType.name}</Table.Cell>
                <Table.Cell>{getValueTypeName(claimType.valueType)}</Table.Cell>
                <Table.Cell>{claimType.description}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {/* Empty state */}
      {!isLoading && claimTypes.length === 0 && (
        <Text textAlign="center" color="gray.500" py={8}>
          {t('AbpIdentity::NoClaimTypesFound') || 'No claim types found'}
        </Text>
      )}

      {/* Claim Type Modal */}
      <Modal
        visible={isModalOpen}
        onVisibleChange={setIsModalOpen}
        header={selectedClaimType?.id ? t('AbpIdentity::Edit') : (t('AbpIdentity::NewClaimType') || 'New Claim Type')}
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
          <FormField label={t('AbpIdentity::ClaimTypeName') || 'Name'} required>
            <Input
              value={formState.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              maxLength={256}
              placeholder={t('AbpIdentity::ClaimTypeName') || 'Name'}
              disabled={selectedClaimType?.isStatic}
            />
          </FormField>

          <FormField label={t('AbpIdentity::ValueType') || 'Value Type'}>
            <NativeSelectRoot>
              <NativeSelectField
                value={formState.valueType}
                onChange={(e) => handleInputChange('valueType', parseInt(e.target.value, 10))}
              >
                {VALUE_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </FormField>

          <FormField label={t('AbpIdentity::Description') || 'Description'}>
            <Textarea
              value={formState.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('AbpIdentity::Description') || 'Description'}
              rows={2}
            />
          </FormField>

          <FormField label={t('AbpIdentity::Regex') || 'Regex'}>
            <Input
              value={formState.regex}
              onChange={(e) => handleInputChange('regex', e.target.value)}
              placeholder={t('AbpIdentity::Regex') || 'Regex pattern'}
            />
          </FormField>

          <FormField label={t('AbpIdentity::RegexDescription') || 'Regex Description'}>
            <Input
              value={formState.regexDescription}
              onChange={(e) => handleInputChange('regexDescription', e.target.value)}
              placeholder={t('AbpIdentity::RegexDescription') || 'Regex description'}
            />
          </FormField>
        </VStack>
      </Modal>
    </Box>
  );
}

export default ClaimsComponent;

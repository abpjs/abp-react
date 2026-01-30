import React, { useEffect, useState, useCallback } from 'react';
import { useLocalization } from '@abpjs/core';
import { Modal, useConfirmation, Toaster, Alert, Button, FormField } from '@abpjs/theme-shared';
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
  HStack,
} from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react';
import { useLanguages, useLanguageTexts } from '../../hooks';
import type { LanguageManagement } from '../../models';

/**
 * Props for LanguageTextsComponent
 * @since 0.7.2
 */
export interface LanguageTextsComponentProps {
  /** Optional callback when a language text is updated */
  onLanguageTextUpdated?: (params: LanguageManagement.LanguageTextUpdateByNameParams) => void;
  /** Optional callback when a language text is restored */
  onLanguageTextRestored?: (params: LanguageManagement.LanguageTextRequestByNameParams) => void;
}

/**
 * Filter state for language texts
 */
interface FilterState {
  resourceName: string;
  baseCultureName: string;
  targetCultureName: string;
  filter: string;
  getOnlyEmptyValues: boolean;
}

const DEFAULT_FILTER_STATE: FilterState = {
  resourceName: '',
  baseCultureName: '',
  targetCultureName: '',
  filter: '',
  getOnlyEmptyValues: false,
};

/**
 * LanguageTextsComponent - Component for managing language texts (localization strings)
 *
 * This is the React equivalent of Angular's LanguageTextsComponent.
 * It displays a table of language texts with editing capabilities.
 *
 * @since 0.7.2
 *
 * @example
 * ```tsx
 * function LanguageManagementPage() {
 *   return (
 *     <LanguageTextsComponent
 *       onLanguageTextUpdated={(params) => console.log('Language text updated:', params)}
 *     />
 *   );
 * }
 * ```
 */
export function LanguageTextsComponent({
  onLanguageTextUpdated,
  onLanguageTextRestored,
}: LanguageTextsComponentProps): React.ReactElement {
  const { t } = useLocalization();
  const confirmation = useConfirmation();

  const { languages, fetchLanguages } = useLanguages();

  const {
    languageTexts,
    totalCount,
    resources,
    selectedLanguageText,
    isLoading,
    error,
    fetchLanguageTexts,
    fetchResources,
    updateLanguageTextByName,
    restoreLanguageTextByName,
    setSelectedLanguageText,
  } = useLanguageTexts();

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // Fetch initial data
  useEffect(() => {
    fetchLanguages();
    fetchResources();
  }, [fetchLanguages, fetchResources]);

  // Set default cultures when languages are loaded
  useEffect(() => {
    if (languages.length > 0 && !filterState.baseCultureName) {
      const defaultLanguage = languages.find((l) => l.isDefaultLanguage);
      const baseCulture = defaultLanguage?.cultureName || languages[0]?.cultureName || 'en';
      const targetCulture = languages.find((l) => !l.isDefaultLanguage)?.cultureName || baseCulture;

      setFilterState((prev) => ({
        ...prev,
        baseCultureName: baseCulture,
        targetCultureName: targetCulture,
      }));
    }
  }, [languages, filterState.baseCultureName]);

  /**
   * Fetch language texts with current filters
   */
  const loadLanguageTexts = useCallback(
    async (page: number = currentPage) => {
      if (!filterState.baseCultureName || !filterState.targetCultureName) return;

      await fetchLanguageTexts({
        resourceName: filterState.resourceName || undefined,
        baseCultureName: filterState.baseCultureName,
        targetCultureName: filterState.targetCultureName,
        getOnlyEmptyValues: filterState.getOnlyEmptyValues,
        filter: filterState.filter || undefined,
        skipCount: page * pageSize,
        maxResultCount: pageSize,
      });
    },
    [filterState, currentPage, pageSize, fetchLanguageTexts]
  );

  // Reload when filters change
  useEffect(() => {
    if (filterState.baseCultureName && filterState.targetCultureName) {
      setCurrentPage(0);
      loadLanguageTexts(0);
    }
  }, [
    filterState.baseCultureName,
    filterState.targetCultureName,
    filterState.resourceName,
    filterState.getOnlyEmptyValues,
  ]);

  /**
   * Handle search
   */
  const handleSearch = useCallback(() => {
    setCurrentPage(0);
    loadLanguageTexts(0);
  }, [loadLanguageTexts]);

  /**
   * Handle edit language text
   */
  const handleEdit = useCallback(
    (languageText: LanguageManagement.LanguageText) => {
      setSelectedLanguageText(languageText);
      setEditValue(languageText.value || '');
      setIsModalOpen(true);
    },
    [setSelectedLanguageText]
  );

  /**
   * Handle restore language text
   */
  const handleRestore = useCallback(
    async (languageText: LanguageManagement.LanguageText) => {
      const status = await confirmation.warn(
        t('AbpLanguageManagement::RestoreToDefaultConfirmationMessage') ||
          'Are you sure you want to restore this text to its default value?',
        t('AbpLanguageManagement::AreYouSure') || 'Are you sure?'
      );

      if (status === Toaster.Status.confirm) {
        const params: LanguageManagement.LanguageTextRequestByNameParams = {
          resourceName: languageText.resourceName,
          cultureName: languageText.cultureName,
          name: languageText.name,
        };
        const result = await restoreLanguageTextByName(params);
        if (result.success) {
          onLanguageTextRestored?.(params);
        }
      }
    },
    [confirmation, t, restoreLanguageTextByName, onLanguageTextRestored]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!selectedLanguageText) return;

    setIsSubmitting(true);

    const params: LanguageManagement.LanguageTextUpdateByNameParams = {
      resourceName: selectedLanguageText.resourceName,
      cultureName: selectedLanguageText.cultureName,
      name: selectedLanguageText.name,
      value: editValue,
    };

    const result = await updateLanguageTextByName(params);

    setIsSubmitting(false);

    if (result.success) {
      onLanguageTextUpdated?.(params);
      setIsModalOpen(false);
      setSelectedLanguageText(null);
      setEditValue('');
    }
  }, [selectedLanguageText, editValue, updateLanguageTextByName, onLanguageTextUpdated, setSelectedLanguageText]);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLanguageText(null);
    setEditValue('');
  }, [setSelectedLanguageText]);

  /**
   * Handle filter input changes
   */
  const handleFilterChange = useCallback(
    (field: keyof FilterState, value: string | boolean) => {
      setFilterState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  /**
   * Handle page change
   */
  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      loadLanguageTexts(newPage);
    },
    [loadLanguageTexts]
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box id="language-management-texts-wrapper" className="card" p={4}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          {t('AbpLanguageManagement::LanguageTexts') || 'Language Texts'}
        </Text>
      </Flex>

      {/* Filters */}
      <VStack gap={4} align="stretch" mb={4}>
        <HStack gap={4} flexWrap="wrap">
          <Box flex="1" minW="200px">
            <FormField label={t('AbpLanguageManagement::Resource') || 'Resource'}>
              <NativeSelectRoot>
                <NativeSelectField
                  value={filterState.resourceName}
                  onChange={(e) => handleFilterChange('resourceName', e.target.value)}
                >
                  <option value="">
                    {t('AbpLanguageManagement::AllResources') || 'All Resources'}
                  </option>
                  {resources.map((resource) => (
                    <option key={resource.name} value={resource.name}>
                      {resource.name}
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </FormField>
          </Box>

          <Box flex="1" minW="200px">
            <FormField label={t('AbpLanguageManagement::BaseCulture') || 'Base Culture'}>
              <NativeSelectRoot>
                <NativeSelectField
                  value={filterState.baseCultureName}
                  onChange={(e) => handleFilterChange('baseCultureName', e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.cultureName} value={lang.cultureName}>
                      {lang.displayName} ({lang.cultureName})
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </FormField>
          </Box>

          <Box flex="1" minW="200px">
            <FormField label={t('AbpLanguageManagement::TargetCulture') || 'Target Culture'}>
              <NativeSelectRoot>
                <NativeSelectField
                  value={filterState.targetCultureName}
                  onChange={(e) => handleFilterChange('targetCultureName', e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.cultureName} value={lang.cultureName}>
                      {lang.displayName} ({lang.cultureName})
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </FormField>
          </Box>
        </HStack>

        <HStack gap={4}>
          <Input
            placeholder={t('AbpLanguageManagement::Filter') || 'Filter by key or value...'}
            value={filterState.filter}
            onChange={(e) => handleFilterChange('filter', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            flex="1"
          />
          <Checkbox.Root
            checked={filterState.getOnlyEmptyValues}
            onCheckedChange={(e) => handleFilterChange('getOnlyEmptyValues', !!e.checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>
              {t('AbpLanguageManagement::OnlyEmptyValues') || 'Only empty values'}
            </Checkbox.Label>
          </Checkbox.Root>
          <Button colorPalette="blue" onClick={handleSearch}>
            {t('AbpLanguageManagement::Search') || 'Search'}
          </Button>
        </HStack>
      </VStack>

      {/* Error */}
      {error && (
        <Alert status="error" mb={4}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {isLoading && languageTexts.length === 0 && (
        <Flex justify="center" py={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Table */}
      {languageTexts.length > 0 && (
        <>
          <Table.Root variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>
                  {t('AbpLanguageManagement::Actions') || 'Actions'}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {t('AbpLanguageManagement::Key') || 'Key'}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {t('AbpLanguageManagement::BaseValue') || 'Base Value'}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {t('AbpLanguageManagement::TargetValue') || 'Target Value'}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {t('AbpLanguageManagement::Resource') || 'Resource'}
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {languageTexts.map((text, index) => (
                <Table.Row key={`${text.resourceName}-${text.name}-${index}`}>
                  <Table.Cell>
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <Button size="sm" colorPalette="blue">
                          {t('AbpLanguageManagement::Actions') || 'Actions'}
                        </Button>
                      </Menu.Trigger>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item value="edit" onClick={() => handleEdit(text)}>
                            {t('AbpLanguageManagement::Edit') || 'Edit'}
                          </Menu.Item>
                          {text.value !== text.baseValue && (
                            <Menu.Item
                              value="restore"
                              color="orange.500"
                              onClick={() => handleRestore(text)}
                            >
                              {t('AbpLanguageManagement::RestoreToDefault') || 'Restore to Default'}
                            </Menu.Item>
                          )}
                        </Menu.Content>
                      </Menu.Positioner>
                    </Menu.Root>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" fontFamily="mono">
                      {text.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.600">
                      {text.baseValue}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text
                      fontSize="sm"
                      color={text.value ? 'inherit' : 'red.500'}
                      fontStyle={text.value ? 'normal' : 'italic'}
                    >
                      {text.value || t('AbpLanguageManagement::NotTranslated') || '(Not translated)'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.500">
                      {text.resourceName}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination */}
          {totalPages > 1 && (
            <Flex justify="space-between" align="center" mt={4}>
              <Text fontSize="sm" color="gray.500">
                {t('AbpLanguageManagement::ShowingXofY', (currentPage * pageSize + 1).toString(), Math.min((currentPage + 1) * pageSize, totalCount).toString(), totalCount.toString()) ||
                  `Showing ${currentPage * pageSize + 1}-${Math.min((currentPage + 1) * pageSize, totalCount)} of ${totalCount}`}
              </Text>
              <HStack gap={2}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  {t('AbpLanguageManagement::Previous') || 'Previous'}
                </Button>
                <Text fontSize="sm">
                  {currentPage + 1} / {totalPages}
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  {t('AbpLanguageManagement::Next') || 'Next'}
                </Button>
              </HStack>
            </Flex>
          )}
        </>
      )}

      {/* Empty state */}
      {!isLoading && languageTexts.length === 0 && filterState.baseCultureName && filterState.targetCultureName && (
        <Text textAlign="center" color="gray.500" py={8}>
          {t('AbpLanguageManagement::NoLanguageTextsFound') || 'No language texts found'}
        </Text>
      )}

      {/* Select cultures message */}
      {!filterState.baseCultureName || !filterState.targetCultureName ? (
        <Text textAlign="center" color="gray.500" py={8}>
          {t('AbpLanguageManagement::SelectCulturesToViewTexts') ||
            'Select base and target cultures to view language texts'}
        </Text>
      ) : null}

      {/* Edit Modal */}
      <Modal
        visible={isModalOpen}
        onVisibleChange={setIsModalOpen}
        header={t('AbpLanguageManagement::EditLanguageText') || 'Edit Language Text'}
        footer={
          <>
            <Button variant="outline" onClick={handleModalClose} disabled={isSubmitting}>
              {t('AbpLanguageManagement::Cancel') || 'Cancel'}
            </Button>
            <Button colorPalette="blue" onClick={handleSubmit} loading={isSubmitting}>
              {t('AbpLanguageManagement::Save') || 'Save'}
            </Button>
          </>
        }
      >
        <VStack gap={4} align="stretch">
          {selectedLanguageText && (
            <>
              <FormField label={t('AbpLanguageManagement::Key') || 'Key'}>
                <Text fontFamily="mono" p={2} bg="gray.100" borderRadius="md">
                  {selectedLanguageText.name}
                </Text>
              </FormField>

              <FormField label={t('AbpLanguageManagement::BaseValue') || 'Base Value'}>
                <Text p={2} bg="gray.100" borderRadius="md" color="gray.600">
                  {selectedLanguageText.baseValue}
                </Text>
              </FormField>

              <FormField label={t('AbpLanguageManagement::TargetValue') || 'Target Value'}>
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder={t('AbpLanguageManagement::EnterTranslation') || 'Enter translation...'}
                  rows={4}
                />
              </FormField>
            </>
          )}
        </VStack>
      </Modal>
    </Box>
  );
}

export default LanguageTextsComponent;

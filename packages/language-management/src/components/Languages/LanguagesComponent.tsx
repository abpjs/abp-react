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
  Badge,
} from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react';
import { useLanguages } from '../../hooks';
import type { LanguageManagement } from '../../models';

/**
 * Props for LanguagesComponent
 * @since 0.7.2
 */
export interface LanguagesComponentProps {
  /** Optional callback when a language is created */
  onLanguageCreated?: (language: LanguageManagement.Language) => void;
  /** Optional callback when a language is updated */
  onLanguageUpdated?: (language: LanguageManagement.Language) => void;
  /** Optional callback when a language is deleted */
  onLanguageDeleted?: (id: string) => void;
}

/**
 * Form state for language modal
 */
interface LanguageFormState {
  cultureName: string;
  uiCultureName: string;
  displayName: string;
  flagIcon: string;
  isEnabled: boolean;
}

const DEFAULT_FORM_STATE: LanguageFormState = {
  cultureName: '',
  uiCultureName: '',
  displayName: '',
  flagIcon: '',
  isEnabled: true,
};

/**
 * LanguagesComponent - Component for managing languages
 *
 * This is the React equivalent of Angular's LanguagesComponent.
 * It displays a table of languages with CRUD operations.
 *
 * @since 0.7.2
 *
 * @example
 * ```tsx
 * function LanguageManagementPage() {
 *   return (
 *     <LanguagesComponent
 *       onLanguageCreated={(lang) => console.log('Language created:', lang)}
 *       onLanguageDeleted={(id) => console.log('Language deleted:', id)}
 *     />
 *   );
 * }
 * ```
 */
export function LanguagesComponent({
  onLanguageCreated,
  onLanguageUpdated,
  onLanguageDeleted,
}: LanguagesComponentProps): React.ReactElement {
  const { t } = useLocalization();
  const confirmation = useConfirmation();

  const {
    languages,
    cultures,
    selectedLanguage,
    isLoading,
    error,
    fetchLanguages,
    fetchCultures,
    getLanguageById,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    setAsDefaultLanguage,
    setSelectedLanguage,
  } = useLanguages();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<LanguageFormState>(DEFAULT_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch languages and cultures on mount
  useEffect(() => {
    fetchLanguages();
    fetchCultures();
  }, [fetchLanguages, fetchCultures]);

  // Filter languages based on search term
  const filteredLanguages = languages.filter(
    (lang) =>
      !searchTerm ||
      lang.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.cultureName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handle add new language
   */
  const handleAdd = useCallback(() => {
    setSelectedLanguage(null);
    setFormState(DEFAULT_FORM_STATE);
    setIsEditing(false);
    setIsModalOpen(true);
  }, [setSelectedLanguage]);

  /**
   * Handle edit language
   */
  const handleEdit = useCallback(
    async (id: string) => {
      const result = await getLanguageById(id);
      if (result.success) {
        setIsEditing(true);
        setIsModalOpen(true);
      }
    },
    [getLanguageById]
  );

  // Update form when selectedLanguage changes
  useEffect(() => {
    if (selectedLanguage && isEditing) {
      setFormState({
        cultureName: selectedLanguage.cultureName || '',
        uiCultureName: selectedLanguage.uiCultureName || '',
        displayName: selectedLanguage.displayName || '',
        flagIcon: selectedLanguage.flagIcon || '',
        isEnabled: selectedLanguage.isEnabled ?? true,
      });
    }
  }, [selectedLanguage, isEditing]);

  /**
   * Handle delete language
   */
  const handleDelete = useCallback(
    async (id: string, displayName: string) => {
      const status = await confirmation.warn(
        t('AbpLanguageManagement::LanguageDeletionConfirmationMessage', displayName) ||
          `Are you sure you want to delete the language '${displayName}'?`,
        t('AbpLanguageManagement::AreYouSure') || 'Are you sure?'
      );

      if (status === Toaster.Status.confirm) {
        const result = await deleteLanguage(id);
        if (result.success) {
          onLanguageDeleted?.(id);
        }
      }
    },
    [confirmation, t, deleteLanguage, onLanguageDeleted]
  );

  /**
   * Handle set as default language
   */
  const handleSetAsDefault = useCallback(
    async (id: string) => {
      const status = await confirmation.info(
        t('AbpLanguageManagement::SetAsDefaultLanguageConfirmationMessage') ||
          'Are you sure you want to set this language as the default?',
        t('AbpLanguageManagement::AreYouSure') || 'Are you sure?'
      );

      if (status === Toaster.Status.confirm) {
        await setAsDefaultLanguage(id);
      }
    },
    [confirmation, t, setAsDefaultLanguage]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!isEditing && !formState.cultureName) return;
    if (!formState.displayName.trim()) return;

    setIsSubmitting(true);

    let result;
    if (isEditing && selectedLanguage?.id) {
      const updateData: LanguageManagement.UpdateLanguageInput = {
        displayName: formState.displayName.trim(),
        flagIcon: formState.flagIcon,
        isEnabled: formState.isEnabled,
      };
      result = await updateLanguage(selectedLanguage.id, updateData);
      if (result.success) {
        onLanguageUpdated?.({
          ...selectedLanguage,
          ...updateData,
        });
      }
    } else {
      const createData: LanguageManagement.CreateLanguageInput = {
        cultureName: formState.cultureName,
        uiCultureName: formState.uiCultureName || formState.cultureName,
        displayName: formState.displayName.trim(),
        flagIcon: formState.flagIcon,
        isEnabled: formState.isEnabled,
      };
      result = await createLanguage(createData);
      if (result.success) {
        onLanguageCreated?.({
          id: '',
          creationTime: new Date().toISOString(),
          creatorId: '',
          isDefaultLanguage: false,
          ...createData,
        });
      }
    }

    setIsSubmitting(false);

    if (result.success) {
      setIsModalOpen(false);
      setFormState(DEFAULT_FORM_STATE);
      setSelectedLanguage(null);
      setIsEditing(false);
    }
  }, [
    formState,
    isEditing,
    selectedLanguage,
    updateLanguage,
    createLanguage,
    onLanguageCreated,
    onLanguageUpdated,
    setSelectedLanguage,
  ]);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setFormState(DEFAULT_FORM_STATE);
    setSelectedLanguage(null);
    setIsEditing(false);
  }, [setSelectedLanguage]);

  /**
   * Handle form input changes
   */
  const handleInputChange = useCallback(
    (field: keyof LanguageFormState, value: string | boolean) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  /**
   * Handle culture selection - auto-fill display name
   */
  const handleCultureChange = useCallback(
    (cultureName: string) => {
      setFormState((prev) => ({
        ...prev,
        cultureName,
        uiCultureName: cultureName,
      }));
      // Find the culture and set the display name
      const culture = cultures.find((c) => c.name === cultureName);
      if (culture) {
        setFormState((prev) => ({
          ...prev,
          displayName: culture.displayName,
        }));
      }
    },
    [cultures]
  );

  return (
    <Box id="language-management-languages-wrapper" className="card" p={4}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          {t('AbpLanguageManagement::Languages') || 'Languages'}
        </Text>
        <Button colorPalette="blue" onClick={handleAdd}>
          {t('AbpLanguageManagement::NewLanguage') || 'New Language'}
        </Button>
      </Flex>

      {/* Search */}
      <Box mb={4}>
        <Input
          placeholder={t('AbpLanguageManagement::Search') || 'Search...'}
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
      {isLoading && languages.length === 0 && (
        <Flex justify="center" py={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Table */}
      {languages.length > 0 && (
        <Table.Root variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>
                {t('AbpLanguageManagement::Actions') || 'Actions'}
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                {t('AbpLanguageManagement::DisplayName') || 'Display Name'}
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                {t('AbpLanguageManagement::CultureName') || 'Culture Name'}
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                {t('AbpLanguageManagement::UiCultureName') || 'UI Culture Name'}
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                {t('AbpLanguageManagement::IsEnabled') || 'Enabled'}
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                {t('AbpLanguageManagement::IsDefaultLanguage') || 'Default'}
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredLanguages.map((language) => (
              <Table.Row key={language.id}>
                <Table.Cell>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button size="sm" colorPalette="blue">
                        {t('AbpLanguageManagement::Actions') || 'Actions'}
                      </Button>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item value="edit" onClick={() => handleEdit(language.id)}>
                          {t('AbpLanguageManagement::Edit') || 'Edit'}
                        </Menu.Item>
                        {!language.isDefaultLanguage && (
                          <>
                            <Menu.Item
                              value="setDefault"
                              onClick={() => handleSetAsDefault(language.id)}
                            >
                              {t('AbpLanguageManagement::SetAsDefaultLanguage') ||
                                'Set as Default'}
                            </Menu.Item>
                            <Menu.Item
                              value="delete"
                              color="red.500"
                              onClick={() => handleDelete(language.id, language.displayName)}
                            >
                              {t('AbpLanguageManagement::Delete') || 'Delete'}
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap={2}>
                    {language.flagIcon && <Text>{language.flagIcon}</Text>}
                    {language.displayName}
                  </Flex>
                </Table.Cell>
                <Table.Cell>{language.cultureName}</Table.Cell>
                <Table.Cell>{language.uiCultureName}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={language.isEnabled ? 'green' : 'red'}>
                    {language.isEnabled
                      ? t('AbpLanguageManagement::Yes') || 'Yes'
                      : t('AbpLanguageManagement::No') || 'No'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {language.isDefaultLanguage && (
                    <Badge colorPalette="blue">
                      {t('AbpLanguageManagement::Default') || 'Default'}
                    </Badge>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {/* Empty state */}
      {!isLoading && languages.length === 0 && (
        <Text textAlign="center" color="gray.500" py={8}>
          {t('AbpLanguageManagement::NoLanguagesFound') || 'No languages found'}
        </Text>
      )}

      {/* Language Modal */}
      <Modal
        visible={isModalOpen}
        onVisibleChange={setIsModalOpen}
        header={
          isEditing
            ? t('AbpLanguageManagement::Edit') || 'Edit'
            : t('AbpLanguageManagement::NewLanguage') || 'New Language'
        }
        footer={
          <>
            <Button variant="outline" onClick={handleModalClose} disabled={isSubmitting}>
              {t('AbpLanguageManagement::Cancel') || 'Cancel'}
            </Button>
            <Button
              colorPalette="blue"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!formState.displayName.trim() || (!isEditing && !formState.cultureName)}
            >
              {t('AbpLanguageManagement::Save') || 'Save'}
            </Button>
          </>
        }
      >
        <VStack gap={4} align="stretch">
          {!isEditing && (
            <FormField label={t('AbpLanguageManagement::CultureName') || 'Culture'} required>
              <NativeSelectRoot>
                <NativeSelectField
                  value={formState.cultureName}
                  onChange={(e) => handleCultureChange(e.target.value)}
                >
                  <option value="">
                    {t('AbpLanguageManagement::SelectCulture') || 'Select a culture...'}
                  </option>
                  {cultures.map((culture) => (
                    <option key={culture.name} value={culture.name}>
                      {culture.displayName} ({culture.name})
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </FormField>
          )}

          {!isEditing && (
            <FormField label={t('AbpLanguageManagement::UiCultureName') || 'UI Culture'}>
              <NativeSelectRoot>
                <NativeSelectField
                  value={formState.uiCultureName}
                  onChange={(e) => handleInputChange('uiCultureName', e.target.value)}
                >
                  <option value="">
                    {t('AbpLanguageManagement::SameAsCulture') || 'Same as culture'}
                  </option>
                  {cultures.map((culture) => (
                    <option key={culture.name} value={culture.name}>
                      {culture.displayName} ({culture.name})
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </FormField>
          )}

          <FormField label={t('AbpLanguageManagement::DisplayName') || 'Display Name'} required>
            <Input
              value={formState.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              maxLength={128}
              placeholder={t('AbpLanguageManagement::DisplayName') || 'Display Name'}
            />
          </FormField>

          <FormField label={t('AbpLanguageManagement::FlagIcon') || 'Flag Icon'}>
            <Input
              value={formState.flagIcon}
              onChange={(e) => handleInputChange('flagIcon', e.target.value)}
              maxLength={48}
              placeholder={t('AbpLanguageManagement::FlagIcon') || 'Flag icon (e.g., emoji)'}
            />
          </FormField>

          <Box>
            <Checkbox.Root
              checked={formState.isEnabled}
              onCheckedChange={(e) => handleInputChange('isEnabled', !!e.checked)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                {t('AbpLanguageManagement::IsEnabled') || 'Enabled'}
              </Checkbox.Label>
            </Checkbox.Root>
          </Box>
        </VStack>
      </Modal>
    </Box>
  );
}

export default LanguagesComponent;

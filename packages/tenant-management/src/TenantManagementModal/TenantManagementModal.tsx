import React, { useEffect, useCallback, useState } from 'react';
import { useLocalization } from '@abpjs/core';
import { Modal } from '@abpjs/theme-shared';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
} from '@chakra-ui/react';
import { useTenantManagement } from '../hooks';

/**
 * Modal view type for tenant management
 */
type ModalView = 'tenant' | 'connectionString';

/**
 * Props for TenantManagementModal component
 */
export interface TenantManagementModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;

  /**
   * Callback when visibility changes
   */
  onVisibleChange?: (visible: boolean) => void;

  /**
   * Tenant ID to edit (if editing)
   */
  tenantId?: string;

  /**
   * Initial view mode
   */
  initialView?: ModalView;

  /**
   * Callback fired when tenant is saved successfully
   */
  onSave?: () => void;
}

/**
 * TenantManagementModal - Modal for managing tenants
 *
 * This is the React equivalent of Angular's TenantsComponent modal functionality.
 * It displays a modal for creating/editing tenants and managing connection strings.
 *
 * @example
 * ```tsx
 * function TenantsPage() {
 *   const [visible, setVisible] = useState(false);
 *   const [editId, setEditId] = useState<string | undefined>();
 *
 *   return (
 *     <>
 *       <Button onClick={() => { setEditId(undefined); setVisible(true); }}>
 *         New Tenant
 *       </Button>
 *       <TenantManagementModal
 *         visible={visible}
 *         onVisibleChange={setVisible}
 *         tenantId={editId}
 *         onSave={() => console.log('Saved!')}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function TenantManagementModal({
  visible,
  onVisibleChange,
  tenantId,
  initialView = 'tenant',
  onSave,
}: TenantManagementModalProps): React.ReactElement {
  const { instant } = useLocalization();

  const {
    selectedTenant,
    isLoading,
    error,
    defaultConnectionString,
    useSharedDatabase,
    fetchTenantById,
    createTenant,
    updateTenant,
    fetchConnectionString,
    updateConnectionString,
    deleteConnectionString,
    reset,
  } = useTenantManagement();

  // Local form state
  const [currentView, setCurrentView] = useState<ModalView>(initialView);
  const [tenantName, setTenantName] = useState('');
  const [tenantNameError, setTenantNameError] = useState<string | null>(null);
  const [localConnectionString, setLocalConnectionString] = useState('');
  const [localUseSharedDatabase, setLocalUseSharedDatabase] = useState(true);

  /**
   * Determine if we're editing or creating
   */
  const isEditing = !!tenantId;

  /**
   * Get modal title based on current view and mode
   */
  const getModalTitle = (): string => {
    if (currentView === 'connectionString') {
      return instant('AbpTenantManagement::ConnectionStrings');
    }
    return isEditing
      ? instant('AbpTenantManagement::Edit')
      : instant('AbpTenantManagement::NewTenant');
  };

  /**
   * Load tenant data when modal opens for editing
   */
  useEffect(() => {
    if (visible && tenantId) {
      fetchTenantById(tenantId);
      if (initialView === 'connectionString') {
        fetchConnectionString(tenantId);
      }
    }

    if (visible) {
      setCurrentView(initialView);
    }

    // Reset when modal closes
    if (!visible) {
      reset();
      setTenantName('');
      setTenantNameError(null);
      setLocalConnectionString('');
      setLocalUseSharedDatabase(true);
    }
  }, [visible, tenantId, initialView, fetchTenantById, fetchConnectionString, reset]);

  /**
   * Sync selected tenant to form state
   */
  useEffect(() => {
    if (selectedTenant) {
      setTenantName(selectedTenant.name);
    }
  }, [selectedTenant]);

  /**
   * Sync connection string state to local form state
   */
  useEffect(() => {
    setLocalConnectionString(defaultConnectionString);
    setLocalUseSharedDatabase(useSharedDatabase);
  }, [defaultConnectionString, useSharedDatabase]);

  /**
   * Validate tenant name
   */
  const validateTenantName = useCallback(
    (name: string): boolean => {
      if (!name || name.trim().length === 0) {
        setTenantNameError(instant('AbpValidation::ThisFieldIsRequired'));
        return false;
      }
      if (name.length > 256) {
        setTenantNameError(
          instant('AbpValidation::ThisFieldMustBeBetween{0}And{1}Characters', '1', '256')
        );
        return false;
      }
      setTenantNameError(null);
      return true;
    },
    [instant]
  );

  /**
   * Handle form submission for tenant
   */
  const handleTenantSubmit = useCallback(async () => {
    if (!validateTenantName(tenantName)) {
      return;
    }

    let result;
    if (isEditing && tenantId) {
      result = await updateTenant({ id: tenantId, name: tenantName.trim() });
    } else {
      result = await createTenant({ name: tenantName.trim() });
    }

    if (result.success) {
      onSave?.();
      onVisibleChange?.(false);
    }
  }, [
    tenantName,
    isEditing,
    tenantId,
    validateTenantName,
    createTenant,
    updateTenant,
    onSave,
    onVisibleChange,
  ]);

  /**
   * Handle form submission for connection string
   */
  const handleConnectionStringSubmit = useCallback(async () => {
    if (!tenantId) return;

    let result;
    if (localUseSharedDatabase) {
      result = await deleteConnectionString(tenantId);
    } else {
      result = await updateConnectionString(tenantId, localConnectionString);
    }

    if (result.success) {
      onSave?.();
      onVisibleChange?.(false);
    }
  }, [
    tenantId,
    localUseSharedDatabase,
    localConnectionString,
    deleteConnectionString,
    updateConnectionString,
    onSave,
    onVisibleChange,
  ]);

  /**
   * Handle modal close
   */
  const handleClose = useCallback(() => {
    onVisibleChange?.(false);
  }, [onVisibleChange]);

  /**
   * Handle tenant name change
   */
  const handleTenantNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTenantName(value);
      if (tenantNameError) {
        validateTenantName(value);
      }
    },
    [tenantNameError, validateTenantName]
  );

  /**
   * Handle use shared database toggle
   */
  const handleUseSharedDatabaseChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalUseSharedDatabase(e.target.checked);
      if (e.target.checked) {
        setLocalConnectionString('');
      }
    },
    []
  );

  /**
   * Handle connection string change
   */
  const handleConnectionStringChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalConnectionString(e.target.value);
  }, []);

  /**
   * Render tenant form content
   */
  const renderTenantForm = () => (
    <VStack spacing={4} align="stretch">
      <FormControl isInvalid={!!tenantNameError} isRequired>
        <FormLabel htmlFor="tenant-name">
          {instant('AbpTenantManagement::TenantName')}
        </FormLabel>
        <Input
          id="tenant-name"
          value={tenantName}
          onChange={handleTenantNameChange}
          placeholder={instant('AbpTenantManagement::TenantName')}
          maxLength={256}
        />
        {tenantNameError && <FormErrorMessage>{tenantNameError}</FormErrorMessage>}
      </FormControl>
    </VStack>
  );

  /**
   * Render connection string form content
   */
  const renderConnectionStringForm = () => (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <Checkbox
          id="use-shared-database"
          isChecked={localUseSharedDatabase}
          onChange={handleUseSharedDatabaseChange}
        >
          {instant('AbpTenantManagement::DisplayName:UseSharedDatabase')}
        </Checkbox>
      </FormControl>

      {!localUseSharedDatabase && (
        <FormControl>
          <FormLabel htmlFor="connection-string">
            {instant('AbpTenantManagement::DisplayName:DefaultConnectionString')}
          </FormLabel>
          <Input
            id="connection-string"
            value={localConnectionString}
            onChange={handleConnectionStringChange}
            placeholder={instant('AbpTenantManagement::DisplayName:DefaultConnectionString')}
          />
        </FormControl>
      )}
    </VStack>
  );

  return (
    <Modal
      visible={visible}
      onVisibleChange={onVisibleChange}
      size="md"
      header={getModalTitle()}
      footer={
        <>
          <Button variant="outline" onClick={handleClose} isDisabled={isLoading}>
            {instant('AbpTenantManagement::Cancel')}
          </Button>
          <Button
            colorScheme="blue"
            onClick={
              currentView === 'connectionString'
                ? handleConnectionStringSubmit
                : handleTenantSubmit
            }
            isLoading={isLoading}
            leftIcon={isLoading ? undefined : <CheckIcon />}
          >
            {instant('AbpTenantManagement::Save')}
          </Button>
        </>
      }
    >
      {/* Loading State */}
      {isLoading && !selectedTenant && currentView === 'tenant' && (
        <Flex justify="center" align="center" py={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Error State */}
      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Content */}
      <Box>
        {currentView === 'tenant' && renderTenantForm()}
        {currentView === 'connectionString' && renderConnectionStringForm()}
      </Box>
    </Modal>
  );
}

/**
 * Simple check icon component
 */
function CheckIcon(): React.ReactElement {
  return (
    <Box as="span" fontSize="sm">
      &#10003;
    </Box>
  );
}

export default TenantManagementModal;

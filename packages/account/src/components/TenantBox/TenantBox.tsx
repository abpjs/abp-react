import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalization, sessionActions, selectTenant } from '@abpjs/core';
import { Modal, Button, useToaster } from '@abpjs/theme-shared';
import { Box, Text, Link, Input, VStack } from '@chakra-ui/react';
import { useAccountService } from '../../hooks/useAccountService';
import { eAccountComponents } from '../../enums';

/**
 * Props for TenantBox component
 */
export interface TenantBoxProps {
  /**
   * Custom styles for the container
   */
  containerStyle?: React.CSSProperties;
}

/**
 * TenantBox - Multi-tenant switching component
 *
 * Displays the currently selected tenant and allows users to switch tenants.
 * This is a direct translation of Angular's TenantBoxComponent.
 *
 * In v0.9.0, this component integrates with the backend tenant resolution API
 * and properly updates the session state.
 *
 * @since 0.9.0 - Now uses AccountService for tenant lookup
 * @since 2.7.0 - Renamed internal properties (name, modalBusy) to match Angular v2.7.0
 *               Uses TenantIdResponse.name from API when available
 */
export function TenantBox({ containerStyle }: TenantBoxProps) {
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const accountService = useAccountService();
  const toaster = useToaster();

  // Get current tenant from Redux store
  const currentTenant = useSelector(selectTenant);

  // Local state
  // v2.7.0: Renamed from tenantName to name to match Angular v2.7.0
  const [name, setName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  // v2.7.0: Renamed from inProgress to modalBusy to match Angular v2.7.0
  const [modalBusy, setModalBusy] = useState(false);

  // Initialize name from store on mount
  useEffect(() => {
    setName(currentTenant?.name || '');
  }, [currentTenant]);

  /**
   * Open the tenant switch modal
   */
  const onSwitch = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  /**
   * Set tenant in session state
   * @since 2.7.0 - Extracted as private method to match Angular pattern
   */
  const setTenant = useCallback(
    (tenant: { id: string; name: string }) => {
      dispatch(sessionActions.setTenant(tenant));
    },
    [dispatch]
  );

  /**
   * Show error toast
   * @since 2.7.0 - Extracted as private method to match Angular pattern
   */
  const showError = useCallback(
    (message: string) => {
      toaster.error(message, t('AbpUi::Error') || 'Error');
    },
    [toaster, t]
  );

  /**
   * Save the selected tenant
   */
  const save = useCallback(async () => {
    if (name) {
      setModalBusy(true);
      try {
        // v2.7.0: TenantIdResponse now includes name property
        const { success, tenantId, name: responseName } = await accountService.findTenant(name);

        if (success) {
          // v2.7.0: Use name from response if available, otherwise use input name
          const tenantName = responseName || name;
          setTenant({ id: tenantId, name: tenantName });
          setIsModalVisible(false);
        } else {
          showError(
            t('AbpUiMultiTenancy::GivenTenantIsNotAvailable', name) ||
              `Tenant "${name}" is not available`
          );
          // Reset name on failure
          setName('');
        }
      } catch (err: any) {
        const errorMessage =
          err?.error?.error_description ||
          err?.error?.error?.message ||
          t('AbpUi::DefaultErrorMessage') ||
          'An error occurred';
        showError(errorMessage);
      } finally {
        setModalBusy(false);
      }
    } else {
      // Clear tenant when name is empty
      setTenant({ id: '', name: '' });
      setIsModalVisible(false);
    }
  }, [name, accountService, setTenant, showError, t]);

  /**
   * Close the modal without saving
   */
  const onClose = useCallback(() => {
    // Reset name to current value
    setName(currentTenant?.name || '');
    setIsModalVisible(false);
  }, [currentTenant]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      save();
    },
    [save]
  );

  return (
    <>
      {/* Tenant Display Box */}
      <Box
        className="tenant-switch-box"
        bg="gray.100"
        mb={5}
        color="black"
        p={2.5}
        textAlign="center"
        borderRadius="md"
        style={containerStyle}
      >
        <Text as="span" color="gray.600">
          {t('AbpUiMultiTenancy::Tenant')}:{' '}
        </Text>
        <Text as="strong">
          <Text as="i">
            {currentTenant?.name || t('AbpUiMultiTenancy::NotSelected')}
          </Text>
        </Text>
        {' ('}
        <Link
          id="abp-tenant-switch-link"
          color="gray.700"
          cursor="pointer"
          onClick={onSwitch}
          _hover={{ textDecoration: 'underline' }}
        >
          {t('AbpUiMultiTenancy::Switch')}
        </Link>
        {')'}
      </Box>

      {/* Tenant Switch Modal */}
      <Modal
        visible={isModalVisible}
        onVisibleChange={setIsModalVisible}
        size="md"
        header={t('AbpUiMultiTenancy::SwitchTenant') || 'Switch Tenant'}
        footer={
          <>
            <Button variant="ghost" colorPalette="gray" onClick={onClose}>
              {t('AbpTenantManagement::Cancel')}
            </Button>
            <Button
              colorPalette="blue"
              onClick={save}
              loading={modalBusy}
              loadingText={t('AbpTenantManagement::Save')}
            >
              <CheckIcon />
              {t('AbpTenantManagement::Save')}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Box>
              <Text as="label" mb={1} display="block">
                {t('AbpUiMultiTenancy::Name')}
              </Text>
              <Input
                id="tenant-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </Box>
            <Text fontSize="sm" color="gray.600">
              {t('AbpUiMultiTenancy::SwitchTenantHint')}
            </Text>
          </VStack>
        </form>
      </Modal>
    </>
  );
}

/**
 * Component key for TenantBox in the component replacement system
 * This can be used to replace the TenantBox component
 * @since 2.7.0
 */
TenantBox.componentKey = eAccountComponents.TenantBox;

/**
 * Simple check icon component
 */
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default TenantBox;

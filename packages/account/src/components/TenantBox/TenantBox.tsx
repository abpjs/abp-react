import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalization, sessionActions, selectTenant } from '@abpjs/core';
import { Modal, Button, useToaster } from '@abpjs/theme-shared';
import { Box, Text, Link, Input, VStack } from '@chakra-ui/react';
import { useAccountService } from '../../hooks/useAccountService';

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
 */
export function TenantBox({ containerStyle }: TenantBoxProps) {
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const accountService = useAccountService();
  const toaster = useToaster();

  // Get current tenant from Redux store
  const currentTenant = useSelector(selectTenant);

  // Local state
  const [tenantName, setTenantName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  // Initialize tenant name from store on mount
  useEffect(() => {
    setTenantName(currentTenant?.name || '');
  }, [currentTenant]);

  /**
   * Open the tenant switch modal
   */
  const onSwitch = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  /**
   * Save the selected tenant
   */
  const save = useCallback(async () => {
    if (tenantName) {
      setInProgress(true);
      try {
        const { success, tenantId } = await accountService.findTenant(tenantName);

        if (success) {
          const newTenant = {
            id: tenantId,
            name: tenantName,
          };
          dispatch(sessionActions.setTenant(newTenant));
          setIsModalVisible(false);
        } else {
          toaster.error(
            t('AbpUiMultiTenancy::GivenTenantIsNotAvailable', tenantName) ||
              `Tenant "${tenantName}" is not available`,
            t('AbpUi::Error') || 'Error'
          );
          // Reset tenant name on failure
          setTenantName('');
        }
      } catch (err: any) {
        const errorMessage =
          err?.error?.error_description ||
          err?.error?.error?.message ||
          t('AbpUi::DefaultErrorMessage') ||
          'An error occurred';
        toaster.error(errorMessage, t('AbpUi::Error') || 'Error');
      } finally {
        setInProgress(false);
      }
    } else {
      // Clear tenant when name is empty
      dispatch(sessionActions.setTenant({ id: '', name: '' }));
      setIsModalVisible(false);
    }
  }, [tenantName, accountService, dispatch, toaster, t]);

  /**
   * Close the modal without saving
   */
  const onClose = useCallback(() => {
    // Reset tenant name to current value
    setTenantName(currentTenant?.name || '');
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
              loading={inProgress}
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
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
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

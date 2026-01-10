import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useLocalization } from '@abpjs/core';
import { Modal } from '@abpjs/theme-shared';
import {
  Box,
  Text,
  Link,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
} from '@chakra-ui/react';
import type { TenantInfo } from '../../models';

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
 * Note: In v0.7.6, this component stores the tenant selection locally
 * and does not integrate with the backend tenant resolution API.
 */
export function TenantBox({ containerStyle }: TenantBoxProps) {
  const { instant } = useLocalization();
  const [selected, setSelected] = useState<TenantInfo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { register, handleSubmit, reset } = useForm<TenantInfo>({
    defaultValues: {
      name: '',
    },
  });

  /**
   * Open the tenant switch modal
   */
  const openModal = useCallback(() => {
    reset({ name: selected?.name || '' });
    setModalVisible(true);
  }, [selected, reset]);

  /**
   * Handle switch button click
   */
  const onSwitch = useCallback(() => {
    setSelected(null);
    openModal();
  }, [openModal]);

  /**
   * Save the selected tenant
   */
  const onSave = useCallback(
    (data: TenantInfo) => {
      setSelected(data.name ? data : null);
      setModalVisible(false);
    },
    []
  );

  /**
   * Close the modal without saving
   */
  const onClose = useCallback(() => {
    setModalVisible(false);
  }, []);

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
          {instant('AbpUiMultiTenancy::Tenant')}:{' '}
        </Text>
        <Text as="strong">
          <Text as="i">
            {selected?.name || instant('AbpUiMultiTenancy::NotSelected')}
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
          {instant('AbpUiMultiTenancy::Switch')}
        </Link>
        {')'}
      </Box>

      {/* Tenant Switch Modal */}
      <Modal
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        size="md"
        header={instant('AbpUiMultiTenancy::SwitchTenant') || 'Switch Tenant'}
        footer={
          <>
            <Button
              variant="ghost"
              colorScheme="gray"
              onClick={onClose}
            >
              {instant('AbpTenantManagement::Cancel')}
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit(onSave)}
              leftIcon={<CheckIcon />}
            >
              {instant('AbpTenantManagement::Save')}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSave)}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel htmlFor="tenant-name">
                {instant('AbpUiMultiTenancy::Name')}
              </FormLabel>
              <Input
                id="tenant-name"
                type="text"
                {...register('name')}
              />
            </FormControl>
            <Text fontSize="sm" color="gray.600">
              {instant('AbpUiMultiTenancy::SwitchTenantHint')}
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

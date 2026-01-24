import React, { useEffect, useCallback } from 'react';
import { useLocalization } from '@abpjs/core';
import { Modal, Alert, Button, Checkbox } from '@abpjs/theme-shared';
import {
  Box,
  Flex,
  Input,
  Spinner,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useFeatureManagement } from '../../hooks';

/**
 * Props for FeatureManagementModal component
 */
export interface FeatureManagementModalProps {
  /**
   * Provider name (e.g., 'T' for Tenant)
   */
  providerName: string;

  /**
   * Provider key (e.g., tenant ID)
   */
  providerKey: string;

  /**
   * Whether the modal is visible
   */
  visible: boolean;

  /**
   * Callback when visibility changes
   */
  onVisibleChange?: (visible: boolean) => void;

  /**
   * Callback fired when features are saved successfully
   */
  onSave?: () => void;
}

/**
 * FeatureManagementModal - Modal for managing entity features
 *
 * This is the React equivalent of Angular's FeatureManagementComponent.
 * It displays a modal with features and allows editing values.
 *
 * @example
 * ```tsx
 * function TenantFeatures({ tenantId }) {
 *   const [visible, setVisible] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setVisible(true)}>Manage Features</Button>
 *       <FeatureManagementModal
 *         providerName="T"
 *         providerKey={tenantId}
 *         visible={visible}
 *         onVisibleChange={setVisible}
 *         onSave={() => console.log('Saved!')}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function FeatureManagementModal({
  providerName,
  providerKey,
  visible,
  onVisibleChange,
  onSave,
}: FeatureManagementModalProps): React.ReactElement {
  const { t } = useLocalization();

  const {
    features,
    isLoading,
    error,
    fetchFeatures,
    saveFeatures,
    updateFeatureValue,
    getFeatureValue,
    isFeatureEnabled,
    reset,
  } = useFeatureManagement();

  /**
   * Fetch features when modal opens
   */
  useEffect(() => {
    if (visible && providerKey && providerName) {
      fetchFeatures(providerKey, providerName);
    }

    // Reset when modal closes
    if (!visible) {
      reset();
    }
  }, [visible, providerKey, providerName, fetchFeatures, reset]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    const result = await saveFeatures(providerKey, providerName);

    if (result.success) {
      onSave?.();
      onVisibleChange?.(false);
    }
  }, [saveFeatures, providerKey, providerName, onSave, onVisibleChange]);

  /**
   * Handle modal close
   */
  const handleClose = useCallback(() => {
    onVisibleChange?.(false);
  }, [onVisibleChange]);

  /**
   * Handle toggle feature change
   */
  const handleToggleChange = useCallback(
    (featureName: string) => {
      const currentValue = getFeatureValue(featureName);
      const newValue = currentValue === 'true' || currentValue === 'True' ? 'false' : 'true';
      updateFeatureValue(featureName, newValue);
    },
    [getFeatureValue, updateFeatureValue]
  );

  /**
   * Handle text input change
   */
  const handleTextChange = useCallback(
    (featureName: string, value: string) => {
      updateFeatureValue(featureName, value);
    },
    [updateFeatureValue]
  );

  /**
   * Render feature input based on value type
   */
  const renderFeatureInput = (feature: (typeof features)[0], index: number) => {
    const valueTypeName = feature.valueType?.name;

    if (valueTypeName === 'ToggleStringValueType') {
      return (
        <Checkbox
          id={`feature-${index}`}
          checked={isFeatureEnabled(feature.name)}
          onChange={() => handleToggleChange(feature.name)}
        >
          {feature.description || ''}
        </Checkbox>
      );
    }

    if (valueTypeName === 'FreeTextStringValueType') {
      return (
        <Input
          id={`feature-${index}`}
          value={getFeatureValue(feature.name)}
          onChange={(e) => handleTextChange(feature.name, e.target.value)}
          placeholder={feature.description || ''}
        />
      );
    }

    // Default: text input
    return (
      <Input
        id={`feature-${index}`}
        value={getFeatureValue(feature.name)}
        onChange={(e) => handleTextChange(feature.name, e.target.value)}
        placeholder={feature.description || ''}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      onVisibleChange={onVisibleChange}
      size="md"
      header={t('AbpTenantManagement::Permission:ManageFeatures')}
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t('AbpFeatureManagement::Cancel')}
          </Button>
          <Button
            colorPalette="blue"
            onClick={handleSubmit}
            loading={isLoading}
          >
            {t('AbpFeatureManagement::Save')}
          </Button>
        </>
      }
    >
      {/* Loading State */}
      {isLoading && features.length === 0 && (
        <Flex justify="center" align="center" py={8}>
          <Spinner size="lg" />
        </Flex>
      )}

      {/* Error State */}
      {error && (
        <Alert status="error" mb={4}>
          {error}
        </Alert>
      )}

      {/* Content */}
      {features.length > 0 && (
        <Box>
          <VStack align="stretch" gap={4}>
            {features.map((feature, index) => (
              <Flex key={feature.name} align="center" gap={4}>
                <Box w="40%">
                  <Text fontWeight="medium">{feature.name}</Text>
                </Box>
                <Box w="60%">{renderFeatureInput(feature, index)}</Box>
              </Flex>
            ))}
          </VStack>
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && features.length === 0 && !error && (
        <Flex justify="center" align="center" py={8}>
          <Text color="gray.500">{t('AbpFeatureManagement::NoFeatures') || 'No features available'}</Text>
        </Flex>
      )}
    </Modal>
  );
}

export default FeatureManagementModal;

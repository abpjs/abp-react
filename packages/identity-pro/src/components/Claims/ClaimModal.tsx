import React, { useEffect, useState, useCallback } from 'react';
import { useLocalization } from '@abpjs/core';
import { Modal, Button, FormField } from '@abpjs/theme-shared';
import {
  Box,
  Flex,
  Input,
  VStack,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { LuTrash, LuPlus } from 'react-icons/lu';
import { useClaims } from '../../hooks';
import type { Identity } from '../../models';

/**
 * Props for ClaimModal component
 * @since 0.7.2
 */
export interface ClaimModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when visibility changes */
  onVisibleChange: (visible: boolean) => void;
  /** Subject ID (user or role ID) */
  subjectId: string;
  /** Subject type ('users' or 'roles') */
  subjectType: 'users' | 'roles';
  /** Callback when claims are saved */
  onSaved?: () => void;
}

/**
 * ClaimModal - Modal for managing claims on users or roles
 *
 * This is the React equivalent of Angular's ClaimModalComponent.
 * It allows adding, editing, and removing claims for a user or role.
 *
 * Pro feature since 0.7.2
 *
 * @example
 * ```tsx
 * function UserClaimsButton({ userId }: { userId: string }) {
 *   const [showClaimModal, setShowClaimModal] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setShowClaimModal(true)}>Manage Claims</Button>
 *       <ClaimModal
 *         visible={showClaimModal}
 *         onVisibleChange={setShowClaimModal}
 *         subjectId={userId}
 *         subjectType="users"
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function ClaimModal({
  visible,
  onVisibleChange,
  subjectId,
  subjectType,
  onSaved,
}: ClaimModalProps): React.ReactElement {
  const { t } = useLocalization();

  const {
    claimTypeNames,
    fetchClaimTypeNames,
    getClaims,
    updateClaims,
    isLoading,
  } = useClaims();

  // Local state
  const [subjectClaims, setSubjectClaims] = useState<Identity.ClaimRequest[]>([]);
  const [newClaimType, setNewClaimType] = useState('');
  const [newClaimValue, setNewClaimValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Initialize modal data
   */
  const initModal = useCallback(async () => {
    if (!visible || !subjectId) return;

    // Fetch claim type names for dropdown
    await fetchClaimTypeNames();

    // Fetch existing claims for the subject
    const claims = await getClaims(subjectId, subjectType);
    setSubjectClaims(claims);
  }, [visible, subjectId, subjectType, fetchClaimTypeNames, getClaims]);

  // Initialize when modal opens
  useEffect(() => {
    if (visible) {
      initModal();
    } else {
      // Reset state when modal closes
      setSubjectClaims([]);
      setNewClaimType('');
      setNewClaimValue('');
    }
  }, [visible, initModal]);

  /**
   * Add a new claim to the list
   */
  const handleAddClaim = useCallback(() => {
    if (!newClaimType.trim() || !newClaimValue.trim()) return;

    const newClaim: Identity.ClaimRequest = {
      claimType: newClaimType.trim(),
      claimValue: newClaimValue.trim(),
      ...(subjectType === 'users' ? { userId: subjectId } : { roleId: subjectId }),
    };

    setSubjectClaims((prev) => [...prev, newClaim]);
    setNewClaimType('');
    setNewClaimValue('');
  }, [newClaimType, newClaimValue, subjectId, subjectType]);

  /**
   * Remove a claim from the list
   */
  const handleRemoveClaim = useCallback((index: number) => {
    setSubjectClaims((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Save claims
   */
  const handleSave = useCallback(async () => {
    setIsSaving(true);

    const result = await updateClaims(subjectId, subjectType, subjectClaims);

    setIsSaving(false);

    if (result.success) {
      onSaved?.();
      onVisibleChange(false);
    }
  }, [subjectId, subjectType, subjectClaims, updateClaims, onSaved, onVisibleChange]);

  /**
   * Handle modal close
   */
  const handleClose = useCallback(() => {
    onVisibleChange(false);
  }, [onVisibleChange]);

  const modalTitle = subjectType === 'users'
    ? (t('AbpIdentity::UserClaims') || 'User Claims')
    : (t('AbpIdentity::RoleClaims') || 'Role Claims');

  return (
    <Modal
      visible={visible}
      onVisibleChange={onVisibleChange}
      header={modalTitle}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            {t('AbpIdentity::Cancel')}
          </Button>
          <Button
            colorPalette="blue"
            onClick={handleSave}
            loading={isSaving}
          >
            {t('AbpIdentity::Save')}
          </Button>
        </>
      }
    >
      <VStack gap={4} align="stretch">
        {/* Add new claim */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Text fontWeight="semibold" mb={3}>
            {t('AbpIdentity::AddNewClaim') || 'Add New Claim'}
          </Text>
          <HStack gap={3} align="flex-end">
            <Box flex={1}>
              <FormField label={t('AbpIdentity::ClaimType') || 'Claim Type'}>
                {claimTypeNames.length > 0 ? (
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={newClaimType}
                      onChange={(e) => setNewClaimType(e.target.value)}
                      placeholder={t('AbpIdentity::SelectClaimType') || 'Select claim type'}
                    >
                      <option value="">{t('AbpIdentity::SelectClaimType') || 'Select claim type'}</option>
                      {claimTypeNames.map((ct) => (
                        <option key={ct.name} value={ct.name}>
                          {ct.name}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                ) : (
                  <Input
                    value={newClaimType}
                    onChange={(e) => setNewClaimType(e.target.value)}
                    placeholder={t('AbpIdentity::ClaimType') || 'Claim type'}
                  />
                )}
              </FormField>
            </Box>
            <Box flex={1}>
              <FormField label={t('AbpIdentity::ClaimValue') || 'Claim Value'}>
                <Input
                  value={newClaimValue}
                  onChange={(e) => setNewClaimValue(e.target.value)}
                  placeholder={t('AbpIdentity::ClaimValue') || 'Claim value'}
                />
              </FormField>
            </Box>
            <IconButton
              aria-label={t('AbpIdentity::Add') || 'Add'}
              colorPalette="blue"
              onClick={handleAddClaim}
              disabled={!newClaimType.trim() || !newClaimValue.trim()}
            >
              <LuPlus />
            </IconButton>
          </HStack>
        </Box>

        {/* Current claims list */}
        <Box>
          <Text fontWeight="semibold" mb={3}>
            {t('AbpIdentity::CurrentClaims') || 'Current Claims'} ({subjectClaims.length})
          </Text>
          {subjectClaims.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={4}>
              {t('AbpIdentity::NoClaimsFound') || 'No claims found'}
            </Text>
          ) : (
            <VStack gap={2} align="stretch">
              {subjectClaims.map((claim, index) => (
                <Flex
                  key={index}
                  justify="space-between"
                  align="center"
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Box>
                    <Text fontWeight="medium">{claim.claimType}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {claim.claimValue}
                    </Text>
                  </Box>
                  <IconButton
                    aria-label={t('AbpIdentity::Remove') || 'Remove'}
                    colorPalette="red"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveClaim(index)}
                  >
                    <LuTrash />
                  </IconButton>
                </Flex>
              ))}
            </VStack>
          )}
        </Box>

        {isLoading && (
          <Text textAlign="center" color="gray.500">
            {t('AbpUi::Loading') || 'Loading...'}
          </Text>
        )}
      </VStack>
    </Modal>
  );
}

export default ClaimModal;

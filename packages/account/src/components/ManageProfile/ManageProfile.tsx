import { useState, useEffect, ReactNode } from 'react';
import { useLocalization, useProfile } from '@abpjs/core';
import { Box, Container, Heading, Stack, Tabs, Spinner, Center } from '@chakra-ui/react';
import { PersonalSettingsForm } from '../PersonalSettingsForm';
import { ChangePasswordForm } from '../ChangePasswordForm';
import { eAccountComponents } from '../../enums';

/**
 * Tab configuration for manage profile
 */
interface ProfileTab {
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * Props for ManageProfile component
 */
export interface ManageProfileProps {
  /**
   * Initial tab index to display
   * @default 0
   */
  defaultTabIndex?: number;

  /**
   * Callback fired when tab changes
   */
  onTabChange?: (index: number) => void;

  /**
   * Custom tabs to add/replace default tabs
   */
  customTabs?: ProfileTab[];

  /**
   * Whether to hide the change password tab.
   * When undefined, this is automatically determined based on the user's profile.
   * External users (social login) don't see the change password tab by default.
   *
   * @since 3.1.0
   */
  hideChangePasswordTab?: boolean;
}

/**
 * ManageProfile - User profile management component
 *
 * This is the React equivalent of Angular's ManageProfileComponent.
 * It provides a tabbed interface for managing user profile settings,
 * including personal information and password change.
 *
 * @since 1.1.0
 * @since 2.7.0 - Added changePasswordKey and personalSettingsKey static properties for component replacement system
 * @since 3.1.0 - Added hideChangePasswordTab prop and loading state; external users don't see change password tab
 *
 * @example
 * ```tsx
 * <ManageProfile
 *   defaultTabIndex={0}
 *   onTabChange={(index) => console.log('Tab changed to', index)}
 * />
 *
 * // Force hide change password tab
 * <ManageProfile hideChangePasswordTab={true} />
 * ```
 */
export function ManageProfile({
  defaultTabIndex = 0,
  onTabChange,
  customTabs,
  hideChangePasswordTab: hideChangePasswordTabProp,
}: ManageProfileProps) {
  const { t } = useLocalization();
  const { profile, loading: profileLoading, fetchProfile } = useProfile();

  // v3.1.0: Loading state until profile is fetched
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState(defaultTabIndex);

  // v3.1.0: Fetch profile on mount and determine tab visibility
  useEffect(() => {
    fetchProfile().then(() => {
      setIsProfileLoaded(true);
    });
  }, [fetchProfile]);

  // v3.1.0: Determine if change password tab should be hidden
  // External users (social login) don't have passwords to change
  const shouldHideChangePasswordTab = hideChangePasswordTabProp ?? profile?.isExternal ?? false;

  // v3.1.0: If change password tab is hidden and default tab is 0, show personal settings instead
  useEffect(() => {
    if (isProfileLoaded && shouldHideChangePasswordTab && selectedTab === 0) {
      // Find the personal settings tab index
      const personalSettingsIndex = 0; // personal-settings is first after filtering
      setSelectedTab(personalSettingsIndex);
    }
  }, [isProfileLoaded, shouldHideChangePasswordTab, selectedTab]);

  // Default tabs matching Angular's implementation
  const allTabs: ProfileTab[] = [
    {
      id: 'personal-settings',
      label: t('AbpAccount::PersonalSettings') || 'Personal Settings',
      content: <PersonalSettingsForm />,
    },
    {
      id: 'change-password',
      label: t('AbpAccount::ChangePassword') || 'Change Password',
      // v3.1.0: Pass hideCurrentPassword based on profile.hasPassword
      content: <ChangePasswordForm hideCurrentPassword={profile?.hasPassword === false} />,
    },
  ];

  // v3.1.0: Filter out change password tab for external users
  const defaultTabs = shouldHideChangePasswordTab
    ? allTabs.filter((tab) => tab.id !== 'change-password')
    : allTabs;

  const tabs = customTabs || defaultTabs;

  const handleTabChange = (details: { value: string }) => {
    const index = tabs.findIndex((tab) => tab.id === details.value);
    if (index !== -1) {
      setSelectedTab(index);
      onTabChange?.(index);
    }
  };

  // v3.1.0: Show loading state until profile is loaded
  if (!isProfileLoaded || profileLoading) {
    return (
      <Box className="manage-profile" py={{ base: '8', md: '12' }}>
        <Container maxW="2xl">
          <Center minH="400px">
            <Spinner size="xl" />
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="manage-profile" py={{ base: '8', md: '12' }}>
      <Container maxW="2xl">
        <Stack gap="8">
          <Heading size="xl">{t('AbpAccount::ManageYourAccount') || 'Manage Your Account'}</Heading>

          <Tabs.Root
            value={tabs[selectedTab]?.id}
            onValueChange={handleTabChange}
            variant="enclosed"
          >
            <Tabs.List>
              {tabs.map((tab) => (
                <Tabs.Trigger key={tab.id} value={tab.id}>
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {tabs.map((tab) => (
              <Tabs.Content key={tab.id} value={tab.id}>
                <Box pt={6}>{tab.content}</Box>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Stack>
      </Container>
    </Box>
  );
}

/**
 * Component key for ChangePassword used in ManageProfile
 * @since 2.7.0
 */
ManageProfile.changePasswordKey = eAccountComponents.ChangePassword;

/**
 * Component key for PersonalSettings used in ManageProfile
 * @since 2.7.0
 */
ManageProfile.personalSettingsKey = eAccountComponents.PersonalSettings;

export default ManageProfile;

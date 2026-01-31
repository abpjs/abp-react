import { useState, ReactNode } from 'react';
import { useLocalization } from '@abpjs/core';
import { Box, Container, Heading, Stack, Tabs } from '@chakra-ui/react';
import { PersonalSettingsForm } from '../PersonalSettingsForm';
import { ChangePasswordForm } from '../ChangePasswordForm';

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
}

/**
 * ManageProfile - User profile management component
 *
 * This is the React equivalent of Angular's ManageProfileComponent.
 * It provides a tabbed interface for managing user profile settings,
 * including personal information and password change.
 *
 * @since 1.1.0
 *
 * @example
 * ```tsx
 * <ManageProfile
 *   defaultTabIndex={0}
 *   onTabChange={(index) => console.log('Tab changed to', index)}
 * />
 * ```
 */
export function ManageProfile({
  defaultTabIndex = 0,
  onTabChange,
  customTabs,
}: ManageProfileProps) {
  const { t } = useLocalization();
  const [selectedTab, setSelectedTab] = useState(defaultTabIndex);

  // Default tabs matching Angular's implementation
  const defaultTabs: ProfileTab[] = [
    {
      id: 'personal-settings',
      label: t('AbpAccount::PersonalSettings') || 'Personal Settings',
      content: <PersonalSettingsForm />,
    },
    {
      id: 'change-password',
      label: t('AbpAccount::ChangePassword') || 'Change Password',
      content: <ChangePasswordForm />,
    },
  ];

  const tabs = customTabs || defaultTabs;

  const handleTabChange = (details: { value: string }) => {
    const index = tabs.findIndex((tab) => tab.id === details.value);
    if (index !== -1) {
      setSelectedTab(index);
      onTabChange?.(index);
    }
  };

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

export default ManageProfile;

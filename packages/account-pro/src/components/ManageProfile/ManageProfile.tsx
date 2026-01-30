import { useState } from 'react';
import { useLocalization } from '@abpjs/core';
import { Box, Heading, Tabs } from '@chakra-ui/react';
import { Container, Stack } from '@chakra-ui/react';
import { ChangePassword } from '../ChangePassword';
import { PersonalSettings } from '../PersonalSettings';

export interface ManageProfileProps {
  defaultTab?: 'personal-settings' | 'change-password';
  onPasswordChanged?: () => void;
  onProfileUpdated?: () => void;
}

/**
 * ManageProfile - Profile management container component
 * @since 0.7.2 (Pro feature)
 */
export function ManageProfile({
  defaultTab = 'personal-settings',
  onPasswordChanged,
  onProfileUpdated,
}: ManageProfileProps) {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Box py={{ base: '12', md: '16' }}>
      <Container maxW="2xl">
        <Stack gap="8">
          <Heading size={{ base: 'xl', md: '2xl' }} textAlign="center">
            {t('AbpAccount::ManageYourProfile') || 'Manage Your Profile'}
          </Heading>
          <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value as 'personal-settings' | 'change-password')}>
            <Tabs.List>
              <Tabs.Trigger value="personal-settings">
                {t('AbpAccount::PersonalSettings') || 'Personal Settings'}
              </Tabs.Trigger>
              <Tabs.Trigger value="change-password">
                {t('AbpAccount::ChangePassword') || 'Change Password'}
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="personal-settings">
              <PersonalSettings onSuccess={onProfileUpdated} />
            </Tabs.Content>
            <Tabs.Content value="change-password">
              <ChangePassword onSuccess={onPasswordChanged} />
            </Tabs.Content>
          </Tabs.Root>
        </Stack>
      </Container>
    </Box>
  );
}

export default ManageProfile;

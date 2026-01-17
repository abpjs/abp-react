import React, { ReactNode, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Link,
  HStack,
  VStack,
  IconButton,
  Collapsible,
  Container,
  Menu,
} from '@chakra-ui/react';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { eLayoutType } from '@abpjs/core';

export interface LayoutAccountProps {
  /** Brand name to display */
  brandName?: string;
  /** Link destination for brand */
  brandLink?: string;
  /** Available languages for the language selector */
  languages?: Array<{ cultureName: string; displayName: string }>;
  /** Currently selected language culture name */
  currentLanguage?: string;
  /** Callback when language is changed */
  onLanguageChange?: (cultureName: string) => void;
  /** Custom children to render */
  children?: ReactNode;
}

/**
 * Account layout component for authentication pages (login, register, etc.).
 * Translated from Angular LayoutAccountComponent.
 *
 * Provides a simpler layout than LayoutApplication, suitable for
 * unauthenticated pages.
 *
 * @example
 * ```tsx
 * <LayoutAccount
 *   brandName="MyApp"
 *   languages={[{ cultureName: 'en', displayName: 'English' }]}
 *   currentLanguage="en"
 *   onLanguageChange={(lang) => setLanguage(lang)}
 * />
 * ```
 */
export function LayoutAccount({
  brandName = 'MyProjectName',
  brandLink = '/',
  languages = [],
  currentLanguage = 'English',
  onLanguageChange,
  children,
}: LayoutAccountProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen(!isOpen);

  // Get current language display name
  const currentLanguageDisplay =
    languages.find((l) => l.cultureName === currentLanguage)?.displayName ||
    currentLanguage ||
    'English';

  // Get dropdown languages (excluding current)
  const dropdownLanguages = languages.filter(
    (l) => l.cultureName !== currentLanguage
  );

  return (
    <>
      {/* Main Navbar */}
      <Box
        as="nav"
        id="main-navbar"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex="sticky"
        bg="gray.800"
        color="white"
        px={4}
        py={2}
      >
        <Flex maxW="container.xl" mx="auto" align="center" wrap="wrap">
          {/* Brand */}
          <Box
            asChild
            fontWeight="bold"
            fontSize="lg"
            color="white"
            _hover={{ textDecoration: 'none' }}
          >
            <RouterLink to={brandLink}>
              {brandName}
            </RouterLink>
          </Box>

          {/* Mobile Toggle */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            variant="ghost"
            color="white"
            aria-label="Toggle Navigation"
            ml="auto"
            _hover={{ bg: 'gray.700' }}
          >
            {isOpen ? <X size={12} /> : <MenuIcon size={20} />}
          </IconButton>

          {/* Desktop Navigation */}
          <HStack
            as="ul"
            listStyleType="none"
            gap={4}
            ml={8}
            display={{ base: 'none', md: 'flex' }}
          >
            <Box as="li">
              <Link
                asChild
                color="white"
                _hover={{ textDecoration: 'none', color: 'gray.300' }}
              >
                <RouterLink to="/">
                  Home
                </RouterLink>
              </Link>
            </Box>
          </HStack>

          <Box flex={1} display={{ base: 'none', md: 'block' }} />

          {/* Language Selector (Desktop) */}
          {languages.length > 0 && (
            <Box id="main-navbar-tools" display={{ base: 'none', md: 'block' }}>
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    variant="ghost"
                    color="white"
                    fontWeight="normal"
                    _hover={{ bg: 'gray.700' }}
                  >
                    {currentLanguageDisplay}
                    <ChevronDown size={16} />
                  </Button>
                </Menu.Trigger>
                <Menu.Positioner>
                  <Menu.Content bg="gray.700" borderColor="gray.600">
                    {dropdownLanguages.map((lang) => (
                      <Menu.Item
                        key={lang.cultureName}
                        value={lang.cultureName}
                        onClick={() => onLanguageChange?.(lang.cultureName)}
                        bg="gray.700"
                        _hover={{ bg: 'gray.600' }}
                      >
                        {lang.displayName}
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
            </Box>
          )}

          {/* Mobile Menu */}
          <Collapsible.Root open={isOpen} style={{ width: '100%' }}>
            <Collapsible.Content>
              <VStack
                display={{ base: 'flex', md: 'none' }}
                pt={4}
                pb={4}
                gap={4}
                align="stretch"
              >
                <Link
                  asChild
                  color="white"
                  _hover={{ textDecoration: 'none', color: 'gray.300' }}
                  py={2}
                >
                  <RouterLink to="/">
                    Home
                  </RouterLink>
                </Link>

                {languages.length > 0 && (
                  <Box borderTop="1px" borderColor="gray.600" pt={4}>
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <Button
                          variant="ghost"
                          color="white"
                          fontWeight="normal"
                          _hover={{ bg: 'gray.700' }}
                          w="full"
                          justifyContent="space-between"
                        >
                          {currentLanguageDisplay}
                          <ChevronDown size={16} />
                        </Button>
                      </Menu.Trigger>
                      <Menu.Positioner>
                        <Menu.Content bg="gray.700" borderColor="gray.600">
                          {dropdownLanguages.map((lang) => (
                            <Menu.Item
                              key={lang.cultureName}
                              value={lang.cultureName}
                              onClick={() => onLanguageChange?.(lang.cultureName)}
                              bg="gray.700"
                              _hover={{ bg: 'gray.600' }}
                            >
                              {lang.displayName}
                            </Menu.Item>
                          ))}
                        </Menu.Content>
                      </Menu.Positioner>
                    </Menu.Root>
                  </Box>
                )}
              </VStack>
            </Collapsible.Content>
          </Collapsible.Root>
        </Flex>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" pt="5rem" pb={4}>
        {children || <Outlet />}
      </Container>
    </>
  );
}

// Static type property for layout system
LayoutAccount.type = eLayoutType.account;

export default LayoutAccount;

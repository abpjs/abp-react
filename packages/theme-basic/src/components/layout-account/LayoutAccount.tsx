import React, { ReactNode } from 'react';
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Link,
  HStack,
  VStack,
  IconButton,
  Collapse,
  Container,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
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
  // Static type for layout system
  LayoutAccount.type = eLayoutType.account;

  const { isOpen, onToggle } = useDisclosure();

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
            as={RouterLink}
            to={brandLink}
            fontWeight="bold"
            fontSize="lg"
            color="white"
            _hover={{ textDecoration: 'none' }}
          >
            {brandName}
          </Box>

          {/* Mobile Toggle */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            color="white"
            aria-label="Toggle Navigation"
            ml="auto"
            _hover={{ bg: 'gray.700' }}
          />

          {/* Desktop Navigation */}
          <HStack
            as="ul"
            listStyleType="none"
            spacing={4}
            ml={8}
            display={{ base: 'none', md: 'flex' }}
          >
            <Box as="li">
              <Link
                as={RouterLink}
                to="/"
                color="white"
                _hover={{ textDecoration: 'none', color: 'gray.300' }}
              >
                Home
              </Link>
            </Box>
          </HStack>

          <Box flex={1} display={{ base: 'none', md: 'block' }} />

          {/* Language Selector (Desktop) */}
          {languages.length > 0 && (
            <Box id="main-navbar-tools" display={{ base: 'none', md: 'block' }}>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  variant="ghost"
                  color="white"
                  fontWeight="normal"
                  _hover={{ bg: 'gray.700' }}
                >
                  {currentLanguageDisplay}
                </MenuButton>
                <MenuList bg="gray.700" borderColor="gray.600">
                  {dropdownLanguages.map((lang) => (
                    <MenuItem
                      key={lang.cultureName}
                      onClick={() => onLanguageChange?.(lang.cultureName)}
                      bg="gray.700"
                      _hover={{ bg: 'gray.600' }}
                    >
                      {lang.displayName}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
          )}

          {/* Mobile Menu */}
          <Collapse in={isOpen} animateOpacity style={{ width: '100%' }}>
            <VStack
              display={{ base: 'flex', md: 'none' }}
              pt={4}
              pb={4}
              spacing={4}
              align="stretch"
            >
              <Link
                as={RouterLink}
                to="/"
                color="white"
                _hover={{ textDecoration: 'none', color: 'gray.300' }}
                py={2}
              >
                Home
              </Link>

              {languages.length > 0 && (
                <Box borderTop="1px" borderColor="gray.600" pt={4}>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      variant="ghost"
                      color="white"
                      fontWeight="normal"
                      _hover={{ bg: 'gray.700' }}
                      w="full"
                      justifyContent="space-between"
                    >
                      {currentLanguageDisplay}
                    </MenuButton>
                    <MenuList bg="gray.700" borderColor="gray.600">
                      {dropdownLanguages.map((lang) => (
                        <MenuItem
                          key={lang.cultureName}
                          onClick={() => onLanguageChange?.(lang.cultureName)}
                          bg="gray.700"
                          _hover={{ bg: 'gray.600' }}
                        >
                          {lang.displayName}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </Box>
              )}
            </VStack>
          </Collapse>
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

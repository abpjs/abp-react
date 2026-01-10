import React, { useEffect, useCallback, useState, useMemo, ReactNode } from 'react';
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Spacer,
  Link,
  HStack,
  VStack,
  useDisclosure,
  IconButton,
  Collapse,
  Container,
} from '@chakra-ui/react';
import { ChevronDownIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import {
  useConfig,
  useSession,
  useAuth,
  useLocalization,
  eLayoutType,
  ABP,
} from '@abpjs/core';
import { useLayoutService, useNavigationElements } from '../../contexts/layout.context';
import { Layout } from '../../models';
import { ChangePassword } from '../change-password';
import { Profile } from '../profile';

export interface LayoutApplicationProps {
  /** Brand name to display */
  brandName?: string;
  /** Link destination for brand */
  brandLink?: string;
  /** Whether to show the language selector */
  showLanguageSelector?: boolean;
  /** Whether to show the current user menu */
  showCurrentUser?: boolean;
  /** Custom children to render in navigation area */
  children?: ReactNode;
}

/**
 * Application layout component for authenticated pages.
 * Translated from Angular LayoutApplicationComponent.
 *
 * Provides:
 * - Navigation menu from routes
 * - Language switcher
 * - Current user menu with logout, change password, profile
 * - Dynamic navigation elements
 *
 * @example
 * ```tsx
 * <LayoutApplication brandName="MyApp" />
 * ```
 */
export function LayoutApplication({
  brandName = 'MyProjectName',
  brandLink = '/',
  showLanguageSelector = true,
  showCurrentUser = true,
  children,
}: LayoutApplicationProps): React.ReactElement {
  // Static type for layout system
  LayoutApplication.type = eLayoutType.application;

  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  useLocalization(); // For localization context

  // State from core
  const { routes, localization, currentUser } = useConfig();
  const { language, setLanguage } = useSession();
  const { logout, isAuthenticated } = useAuth();

  // Layout state
  const layoutService = useLayoutService();
  const navigationElements = useNavigationElements();

  // Modal states
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Get visible routes (filter out invisible ones)
  const visibleRoutes = useMemo(() => {
    return getVisibleRoutes(routes || []);
  }, [routes]);

  // Get languages from localization config
  const languages = useMemo(() => {
    return localization?.languages || [];
  }, [localization]);

  // Get current language display name
  const currentLanguageDisplay = useMemo(() => {
    const currentLang = languages.find((lang) => lang.cultureName === language);
    return currentLang?.displayName || '';
  }, [languages, language]);

  // Get dropdown languages (excluding current)
  const dropdownLanguages = useMemo(() => {
    return languages.filter((lang) => lang.cultureName !== language);
  }, [languages, language]);

  // Get right part elements (sorted by order)
  const rightPartElements = useMemo(() => {
    return navigationElements.map((nav) => nav.element);
  }, [navigationElements]);

  // Add default navigation elements on mount
  useEffect(() => {
    const existingNames = navigationElements.map((el) => el.name);

    const elementsToAdd: Layout.NavigationElement[] = [];

    if (showLanguageSelector && !existingNames.includes('LanguageRef')) {
      elementsToAdd.push({
        element: (
          <LanguageSelector
            key="language-selector"
            currentLanguage={currentLanguageDisplay}
            languages={dropdownLanguages}
            onLanguageChange={setLanguage}
          />
        ),
        order: 4,
        name: 'LanguageRef',
      });
    }

    if (showCurrentUser && !existingNames.includes('CurrentUserRef')) {
      elementsToAdd.push({
        element: (
          <CurrentUserMenu
            key="current-user"
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            onChangePassword={() => setIsChangePasswordOpen(true)}
            onProfile={() => setIsProfileOpen(true)}
            onLogout={handleLogout}
          />
        ),
        order: 5,
        name: 'CurrentUserRef',
      });
    }

    if (elementsToAdd.length > 0) {
      layoutService.addNavigationElement(elementsToAdd);
    }
  }, []);

  // Update navigation elements when dependencies change
  useEffect(() => {
    // Update language selector if it exists
    if (showLanguageSelector && navigationElements.some((el) => el.name === 'LanguageRef')) {
      layoutService.removeNavigationElement('LanguageRef');
      layoutService.addNavigationElement({
        element: (
          <LanguageSelector
            key="language-selector"
            currentLanguage={currentLanguageDisplay}
            languages={dropdownLanguages}
            onLanguageChange={setLanguage}
          />
        ),
        order: 4,
        name: 'LanguageRef',
      });
    }
  }, [currentLanguageDisplay, dropdownLanguages]);

  // Update current user menu when user changes
  useEffect(() => {
    if (showCurrentUser && navigationElements.some((el) => el.name === 'CurrentUserRef')) {
      layoutService.removeNavigationElement('CurrentUserRef');
      layoutService.addNavigationElement({
        element: (
          <CurrentUserMenu
            key="current-user"
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            onChangePassword={() => setIsChangePasswordOpen(true)}
            onProfile={() => setIsProfileOpen(true)}
            onLogout={handleLogout}
          />
        ),
        order: 5,
        name: 'CurrentUserRef',
      });
    }
  }, [currentUser, isAuthenticated]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/account/login');
  }, [logout, navigate]);

  // handleLanguageChange is used in navigation elements via setLanguage directly

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
            {visibleRoutes.map((route) => (
              <NavItem key={route.name} route={route} />
            ))}
          </HStack>

          <Spacer display={{ base: 'none', md: 'block' }} />

          {/* Right Part Elements (Desktop) */}
          <HStack
            as="ul"
            listStyleType="none"
            spacing={4}
            display={{ base: 'none', md: 'flex' }}
          >
            {rightPartElements.map((element, index) => (
              <Box as="li" key={index}>
                {element}
              </Box>
            ))}
          </HStack>

          {/* Mobile Menu */}
          <Collapse in={isOpen} animateOpacity style={{ width: '100%' }}>
            <VStack
              display={{ base: 'flex', md: 'none' }}
              pt={4}
              pb={4}
              spacing={4}
              align="stretch"
            >
              {visibleRoutes.map((route) => (
                <NavItem key={route.name} route={route} isMobile />
              ))}
              <Box borderTop="1px" borderColor="gray.600" pt={4}>
                {rightPartElements.map((element, index) => (
                  <Box key={index} py={1}>
                    {element}
                  </Box>
                ))}
              </Box>
            </VStack>
          </Collapse>
        </Flex>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" pt="5rem" pb={4}>
        {children || <Outlet />}
      </Container>

      {/* Modals */}
      <ChangePassword
        visible={isChangePasswordOpen}
        onVisibleChange={setIsChangePasswordOpen}
      />
      <Profile visible={isProfileOpen} onVisibleChange={setIsProfileOpen} />
    </>
  );
}

// Static type property for layout system
LayoutApplication.type = eLayoutType.application;

/**
 * Navigation item component for routes
 */
interface NavItemProps {
  route: ABP.FullRoute;
  isMobile?: boolean;
}

function NavItem({ route, isMobile = false }: NavItemProps): React.ReactElement | null {
  const hasChildren = route.children && route.children.length > 0;

  if (hasChildren) {
    return (
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant="ghost"
          color="white"
          fontWeight="normal"
          _hover={{ bg: 'gray.700' }}
          w={isMobile ? 'full' : 'auto'}
          justifyContent={isMobile ? 'space-between' : 'center'}
        >
          {route.name}
        </MenuButton>
        <MenuList bg="gray.700" borderColor="gray.600">
          {route.children?.map((child) => {
            const childRoute = child as ABP.FullRoute;
            return (
              <MenuItem
                key={child.name}
                as={RouterLink}
                to={childRoute.url || child.path || ''}
                bg="gray.700"
                _hover={{ bg: 'gray.600' }}
              >
                {child.name}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    );
  }

  return (
    <Box as="li">
      <Link
        as={RouterLink}
        to={route.url || route.path || ''}
        color="white"
        _hover={{ textDecoration: 'none', color: 'gray.300' }}
        display="block"
        py={isMobile ? 2 : 0}
      >
        {route.name}
      </Link>
    </Box>
  );
}

/**
 * Language selector dropdown component
 */
interface LanguageSelectorProps {
  currentLanguage: string;
  languages: Array<{ cultureName: string; displayName?: string }>;
  onLanguageChange: (cultureName: string) => void;
}

function LanguageSelector({
  currentLanguage,
  languages,
  onLanguageChange,
}: LanguageSelectorProps): React.ReactElement | null {
  if (languages.length === 0) {
    return null;
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="ghost"
        color="white"
        fontWeight="normal"
        _hover={{ bg: 'gray.700' }}
      >
        {currentLanguage}
      </MenuButton>
      <MenuList bg="gray.700" borderColor="gray.600">
        {languages.map((lang) => (
          <MenuItem
            key={lang.cultureName}
            onClick={() => onLanguageChange(lang.cultureName)}
            bg="gray.700"
            _hover={{ bg: 'gray.600' }}
          >
            {lang.displayName}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

/**
 * Current user dropdown menu component
 */
interface CurrentUserMenuProps {
  currentUser?: { userName?: string; isAuthenticated?: boolean } | null;
  isAuthenticated: boolean;
  onChangePassword: () => void;
  onProfile: () => void;
  onLogout: () => void;
}

function CurrentUserMenu({
  currentUser,
  isAuthenticated,
  onChangePassword,
  onProfile,
  onLogout,
}: CurrentUserMenuProps): React.ReactElement | null {
  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="ghost"
        color="white"
        fontWeight="normal"
        _hover={{ bg: 'gray.700' }}
      >
        {currentUser.userName}
      </MenuButton>
      <MenuList bg="gray.700" borderColor="gray.600">
        <MenuItem
          onClick={onChangePassword}
          bg="gray.700"
          _hover={{ bg: 'gray.600' }}
        >
          Change Password
        </MenuItem>
        <MenuItem
          onClick={onProfile}
          bg="gray.700"
          _hover={{ bg: 'gray.600' }}
        >
          My Profile
        </MenuItem>
        <MenuItem
          onClick={onLogout}
          bg="gray.700"
          _hover={{ bg: 'gray.600' }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

/**
 * Recursively filter routes to only show visible ones.
 * Translated from Angular getVisibleRoutes function.
 */
function getVisibleRoutes(routes: ABP.FullRoute[]): ABP.FullRoute[] {
  return routes.reduce<ABP.FullRoute[]>((acc, val) => {
    if (val.invisible) {
      return acc;
    }

    const route = { ...val };
    if (route.children && route.children.length) {
      route.children = getVisibleRoutes(route.children);
    }

    return [...acc, route];
  }, []);
}

export default LayoutApplication;

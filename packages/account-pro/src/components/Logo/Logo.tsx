import { useConfig } from '@abpjs/core';
import { Box, Image, Text } from '@chakra-ui/react';

/**
 * Props for Logo component
 */
export interface LogoProps {
  /**
   * Custom logo URL. If not provided, uses the application name as text.
   */
  logoUrl?: string;

  /**
   * Alt text for the logo image
   * @default "Logo"
   */
  alt?: string;

  /**
   * Maximum width of the logo
   * @default "150px"
   */
  maxWidth?: string;

  /**
   * Maximum height of the logo
   * @default "50px"
   */
  maxHeight?: string;

  /**
   * Custom children to render instead of the default logo
   */
  children?: JSX.Element | null;
}

/**
 * LogoComponent - Displays the application logo
 *
 * This is the React equivalent of Angular's LogoComponent from @volo/abp.ng.account.
 * It displays the application logo on account pages (login, register, etc.).
 *
 * @since 2.9.0
 *
 * @example
 * ```tsx
 * // Default usage - displays app name as text
 * <Logo />
 *
 * // With custom logo URL
 * <Logo logoUrl="/assets/logo.png" alt="My App Logo" />
 *
 * // With custom children
 * <Logo>
 *   <img src="/custom-logo.svg" alt="Custom" />
 * </Logo>
 * ```
 */
export function Logo({
  logoUrl,
  alt = 'Logo',
  maxWidth = '150px',
  maxHeight = '50px',
  children,
}: LogoProps) {
  const config = useConfig();

  // If custom children are provided, render them
  if (children) {
    return <Box>{children}</Box>;
  }

  // If logo URL is provided, render image
  if (logoUrl) {
    return (
      <Box>
        <Image
          src={logoUrl}
          alt={alt}
          maxW={maxWidth}
          maxH={maxHeight}
          objectFit="contain"
        />
      </Box>
    );
  }

  // Default: render application name as text
  const appName = config.localization?.currentCulture?.displayName ||
    config.localization?.defaultResourceName ||
    'ABP';

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold">
        {appName}
      </Text>
    </Box>
  );
}

/**
 * Static component key for component replacement
 * @since 2.9.0
 */
Logo.componentKey = 'Account.LogoComponent' as const;

export default Logo;

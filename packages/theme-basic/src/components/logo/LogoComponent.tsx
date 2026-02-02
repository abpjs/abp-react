import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useBranding } from '../../contexts/branding.context';
import { DefaultLogo } from '../blocks/sidebars/sidebar-with-collapsible/logo';

/**
 * Props for the LogoComponent.
 * @since 2.7.0
 */
export interface LogoComponentProps {
  /** Custom styles for the logo container */
  style?: React.CSSProperties;
  /** Custom link path (overrides branding logoLink if provided) */
  linkTo?: string;
}

/**
 * Public API Logo component that displays the application logo.
 * Uses the branding configuration from BrandingProvider.
 *
 * This component is part of the theme-basic public API and can be
 * replaced using the component replacement system with eThemeBasicComponents.Logo.
 *
 * @since 2.7.0 - Added as public API component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LogoComponent />
 *
 * // With custom link
 * <LogoComponent linkTo="/dashboard" />
 * ```
 */
export function LogoComponent({ style, linkTo }: LogoComponentProps): React.ReactElement {
  const { logo, appName, logoLink } = useBranding();

  // Use logo if provided, otherwise use appName as text, or fall back to DefaultLogo
  const logoContent = logo || (appName ? (
    <Text fontWeight="bold" fontSize="lg">
      {appName}
    </Text>
  ) : (
    <DefaultLogo style={style} />
  ));

  return (
    <Box asChild style={style}>
      <RouterLink to={linkTo || logoLink || '/'}>{logoContent}</RouterLink>
    </Box>
  );
}

export default LogoComponent;

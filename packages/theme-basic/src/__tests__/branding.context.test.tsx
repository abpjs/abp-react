import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrandingProvider, useBranding, useLogo } from '../contexts/branding.context';

// Test component that uses the branding hooks
function BrandingConsumer() {
  const branding = useBranding();
  return (
    <div>
      <span data-testid="app-name">{branding.appName}</span>
      <span data-testid="logo-link">{branding.logoLink}</span>
      <span data-testid="has-logo">{branding.logo ? 'yes' : 'no'}</span>
      <span data-testid="has-logo-icon">{branding.logoIcon ? 'yes' : 'no'}</span>
    </div>
  );
}

function LogoConsumer({ preferIcon = false }: { preferIcon?: boolean }) {
  const logo = useLogo(preferIcon);
  return <div data-testid="logo">{logo}</div>;
}

describe('BrandingContext', () => {
  describe('BrandingProvider', () => {
    it('should provide default branding values', () => {
      render(
        <BrandingProvider>
          <BrandingConsumer />
        </BrandingProvider>
      );

      expect(screen.getByTestId('app-name')).toHaveTextContent('ABP Application');
      expect(screen.getByTestId('logo-link')).toHaveTextContent('/');
      expect(screen.getByTestId('has-logo')).toHaveTextContent('no');
    });

    it('should provide custom app name', () => {
      render(
        <BrandingProvider appName="Custom App">
          <BrandingConsumer />
        </BrandingProvider>
      );

      expect(screen.getByTestId('app-name')).toHaveTextContent('Custom App');
    });

    it('should provide custom logo link', () => {
      render(
        <BrandingProvider logoLink="/home">
          <BrandingConsumer />
        </BrandingProvider>
      );

      expect(screen.getByTestId('logo-link')).toHaveTextContent('/home');
    });

    it('should provide custom logo', () => {
      render(
        <BrandingProvider logo={<span>Logo</span>}>
          <BrandingConsumer />
        </BrandingProvider>
      );

      expect(screen.getByTestId('has-logo')).toHaveTextContent('yes');
    });

    it('should fallback logoIcon to logo if not provided', () => {
      render(
        <BrandingProvider logo={<span>Logo</span>}>
          <BrandingConsumer />
        </BrandingProvider>
      );

      expect(screen.getByTestId('has-logo-icon')).toHaveTextContent('yes');
    });

    it('should use separate logoIcon when provided', () => {
      render(
        <BrandingProvider logo={<span>Full Logo</span>} logoIcon={<span>Icon</span>}>
          <BrandingConsumer />
        </BrandingProvider>
      );

      expect(screen.getByTestId('has-logo')).toHaveTextContent('yes');
      expect(screen.getByTestId('has-logo-icon')).toHaveTextContent('yes');
    });
  });

  describe('useBranding', () => {
    it('should return branding config', () => {
      render(
        <BrandingProvider appName="Test App" logoLink="/test">
          <BrandingConsumer />
        </BrandingProvider>
      );

      expect(screen.getByTestId('app-name')).toHaveTextContent('Test App');
      expect(screen.getByTestId('logo-link')).toHaveTextContent('/test');
    });
  });

  describe('useLogo', () => {
    it('should return appName when no logo is provided', () => {
      render(
        <BrandingProvider appName="Fallback Name">
          <LogoConsumer />
        </BrandingProvider>
      );

      expect(screen.getByTestId('logo')).toHaveTextContent('Fallback Name');
    });

    it('should return logo when provided', () => {
      render(
        <BrandingProvider logo={<span>Main Logo</span>}>
          <LogoConsumer />
        </BrandingProvider>
      );

      expect(screen.getByTestId('logo')).toHaveTextContent('Main Logo');
    });

    it('should return logoIcon when preferIcon is true and logoIcon exists', () => {
      render(
        <BrandingProvider logo={<span>Full</span>} logoIcon={<span>Icon Only</span>}>
          <LogoConsumer preferIcon />
        </BrandingProvider>
      );

      expect(screen.getByTestId('logo')).toHaveTextContent('Icon Only');
    });

    it('should return full logo when preferIcon is true but logoIcon is same as logo', () => {
      render(
        <BrandingProvider logo={<span>Same Logo</span>}>
          <LogoConsumer preferIcon />
        </BrandingProvider>
      );

      // When logoIcon is not explicitly set, it falls back to logo
      expect(screen.getByTestId('logo')).toHaveTextContent('Same Logo');
    });
  });
});

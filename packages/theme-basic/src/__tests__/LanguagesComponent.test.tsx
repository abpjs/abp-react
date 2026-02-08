/**
 * Tests for LanguagesComponent v4.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { LanguagesComponent } from '../components/nav-items/LanguagesComponent';

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
});

// Mock @abpjs/core hooks
const mockSetLanguage = vi.fn();
const mockUseConfig = vi.fn();
const mockUseSession = vi.fn();

vi.mock('@abpjs/core', () => ({
  useConfig: () => mockUseConfig(),
  useSession: () => mockUseSession(),
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="language-button" {...props}>{children}</button>
  ),
  HStack: ({ children, ...props }: any) => <div data-testid="hstack" {...props}>{children}</div>,
  Menu: {
    Root: ({ children }: any) => <div data-testid="menu-root">{children}</div>,
    Trigger: ({ children, asChild: _asChild }: any) => <div data-testid="menu-trigger">{children}</div>,
    Positioner: ({ children }: any) => <div data-testid="menu-positioner">{children}</div>,
    Content: ({ children }: any) => <div data-testid="menu-content">{children}</div>,
    Item: ({ children, onClick, value }: any) => (
      <button data-testid={`menu-item-${value}`} onClick={onClick}>{children}</button>
    ),
  },
  Portal: ({ children }: any) => <div data-testid="portal">{children}</div>,
  Text: ({ children, ...props }: any) => <span data-testid="text" {...props}>{children}</span>,
}));

// Mock react-icons
vi.mock('react-icons/lu', () => ({
  LuChevronDown: () => <span data-testid="icon-chevron" />,
  LuGlobe: () => <span data-testid="icon-globe" />,
}));

describe('LanguagesComponent', () => {
  const renderComponent = (props = {}) => {
    return render(<LanguagesComponent {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when no languages available', () => {
    beforeEach(() => {
      mockUseConfig.mockReturnValue({ localization: { languages: [] } });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });
    });

    it('should return null when no languages', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when only one language available', () => {
    beforeEach(() => {
      mockUseConfig.mockReturnValue({
        localization: {
          languages: [{ cultureName: 'en', displayName: 'English' }],
        },
      });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });
    });

    it('should return null when only one language', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when multiple languages available', () => {
    const mockLanguages = [
      { cultureName: 'en', displayName: 'English' },
      { cultureName: 'tr', displayName: 'Turkce' },
      { cultureName: 'ar', displayName: 'Arabic' },
    ];

    beforeEach(() => {
      mockUseConfig.mockReturnValue({
        localization: { languages: mockLanguages },
      });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });
    });

    it('should render language selector', () => {
      renderComponent();
      expect(screen.getByTestId('menu-root')).toBeInTheDocument();
    });

    it('should render globe icon', () => {
      renderComponent();
      expect(screen.getByTestId('icon-globe')).toBeInTheDocument();
    });

    it('should render chevron icon', () => {
      renderComponent();
      expect(screen.getByTestId('icon-chevron')).toBeInTheDocument();
    });

    it('should display current language name', () => {
      renderComponent();
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should render dropdown items for other languages', () => {
      renderComponent();
      expect(screen.getByTestId('menu-item-tr')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-ar')).toBeInTheDocument();
    });

    it('should not render dropdown item for current language', () => {
      renderComponent();
      expect(screen.queryByTestId('menu-item-en')).not.toBeInTheDocument();
    });

    it('should display language names in dropdown', () => {
      renderComponent();
      expect(screen.getByText('Turkce')).toBeInTheDocument();
      expect(screen.getByText('Arabic')).toBeInTheDocument();
    });

    it('should call setLanguage when language is selected', () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('menu-item-tr'));
      expect(mockSetLanguage).toHaveBeenCalledWith('tr');
    });

    it('should reload page when language is selected', () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('menu-item-tr'));
      expect(mockReload).toHaveBeenCalled();
    });
  });

  describe('compact mode', () => {
    const mockLanguages = [
      { cultureName: 'en', displayName: 'English' },
      { cultureName: 'tr', displayName: 'Turkce' },
    ];

    beforeEach(() => {
      mockUseConfig.mockReturnValue({
        localization: { languages: mockLanguages },
      });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });
    });

    it('should not display language name in compact mode', () => {
      renderComponent({ compact: true });
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });

    it('should still display globe icon in compact mode', () => {
      renderComponent({ compact: true });
      expect(screen.getByTestId('icon-globe')).toBeInTheDocument();
    });
  });

  describe('fallback behaviors', () => {
    it('should use cultureName when displayName is missing', () => {
      mockUseConfig.mockReturnValue({
        localization: {
          languages: [
            { cultureName: 'en' },
            { cultureName: 'tr' },
          ],
        },
      });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });

      renderComponent();
      expect(screen.getByText('en')).toBeInTheDocument();
      expect(screen.getByText('tr')).toBeInTheDocument();
    });

    it('should handle undefined localization', () => {
      mockUseConfig.mockReturnValue({ localization: undefined });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });

      const { container } = renderComponent();
      expect(container.firstChild).toBeNull();
    });

    it('should handle null languages array', () => {
      mockUseConfig.mockReturnValue({ localization: { languages: null } });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });

      const { container } = renderComponent();
      expect(container.firstChild).toBeNull();
    });

    it('should handle missing current language in list', () => {
      mockUseConfig.mockReturnValue({
        localization: {
          languages: [
            { cultureName: 'tr', displayName: 'Turkce' },
            { cultureName: 'ar', displayName: 'Arabic' },
          ],
        },
      });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });

      renderComponent();
      // Should render with empty display name but still show the selector
      expect(screen.getByTestId('menu-root')).toBeInTheDocument();
    });
  });

  describe('v4.0.0: LanguageInfo with optional cultureName', () => {
    it('should handle languages with undefined cultureName', () => {
      mockUseConfig.mockReturnValue({
        localization: {
          languages: [
            { cultureName: 'en', displayName: 'English' },
            { displayName: 'Unknown Language' },
          ],
        },
      });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });

      renderComponent();
      // Should render — the undefined cultureName language falls through as a dropdown item
      expect(screen.getByTestId('menu-root')).toBeInTheDocument();
      expect(screen.getByText('Unknown Language')).toBeInTheDocument();
    });

    it('should use empty string fallback for undefined cultureName in value prop', () => {
      mockUseConfig.mockReturnValue({
        localization: {
          languages: [
            { cultureName: 'en', displayName: 'English' },
            { displayName: 'No Culture' },
          ],
        },
      });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });

      renderComponent();
      // The menu item with undefined cultureName should use '' as value
      expect(screen.getByTestId('menu-item-')).toBeInTheDocument();
    });

    it('should call setLanguage with empty string for undefined cultureName', () => {
      mockUseConfig.mockReturnValue({
        localization: {
          languages: [
            { cultureName: 'en', displayName: 'English' },
            { displayName: 'No Culture' },
          ],
        },
      });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });

      renderComponent();
      fireEvent.click(screen.getByTestId('menu-item-'));
      expect(mockSetLanguage).toHaveBeenCalledWith('');
    });

    it('should handle all optional LanguageInfo fields', () => {
      mockUseConfig.mockReturnValue({
        localization: {
          languages: [
            { cultureName: 'en', displayName: 'English' },
            { cultureName: 'tr' },  // no displayName, no flagIcon, no uiCultureName
          ],
        },
      });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });

      renderComponent();
      // Should fall back to cultureName when displayName is missing
      expect(screen.getByText('tr')).toBeInTheDocument();
    });

    it('should handle empty session language with LanguageInfo', () => {
      mockUseConfig.mockReturnValue({
        localization: {
          languages: [
            { cultureName: 'en', displayName: 'English' },
            { cultureName: 'tr', displayName: 'Turkce' },
          ],
        },
      });
      mockUseSession.mockReturnValue({ language: '', setLanguage: mockSetLanguage });

      renderComponent();
      // All languages should be in dropdown since none matches ''
      expect(screen.getByTestId('menu-item-en')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-tr')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    const mockLanguages = [
      { cultureName: 'en', displayName: 'English' },
      { cultureName: 'tr', displayName: 'Turkce' },
    ];

    beforeEach(() => {
      mockUseConfig.mockReturnValue({
        localization: { languages: mockLanguages },
      });
      mockUseSession.mockReturnValue({ language: 'en', setLanguage: mockSetLanguage });
    });

    it('should accept smallScreen prop', () => {
      expect(() => renderComponent({ smallScreen: true })).not.toThrow();
    });

    it('should accept containerStyle prop', () => {
      expect(() => renderComponent({ containerStyle: { marginTop: '10px' } })).not.toThrow();
    });

    it('should accept menuZIndex prop', () => {
      expect(() => renderComponent({ menuZIndex: 2000 })).not.toThrow();
    });
  });
});

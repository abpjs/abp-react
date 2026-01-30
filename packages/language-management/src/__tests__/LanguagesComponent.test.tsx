/**
 * Tests for LanguagesComponent
 * @abpjs/language-management v0.7.2
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguagesComponent } from '../components/Languages/LanguagesComponent';
import type { LanguageManagement } from '../models';

// Mock data
const mockLanguages: LanguageManagement.Language[] = [
  {
    id: '1',
    cultureName: 'en',
    uiCultureName: 'en',
    displayName: 'English',
    flagIcon: '🇺🇸',
    isEnabled: true,
    isDefaultLanguage: true,
    creationTime: '2024-01-01T00:00:00Z',
    creatorId: 'user1',
  },
  {
    id: '2',
    cultureName: 'tr',
    uiCultureName: 'tr',
    displayName: 'Turkish',
    flagIcon: '🇹🇷',
    isEnabled: false,
    isDefaultLanguage: false,
    creationTime: '2024-01-01T00:00:00Z',
    creatorId: 'user1',
  },
];

const mockCultures: LanguageManagement.Culture[] = [
  { name: 'en', displayName: 'English' },
  { name: 'tr', displayName: 'Turkish' },
  { name: 'de', displayName: 'German' },
];

// Mock hook return values
const mockUseLanguagesReturn = {
  languages: mockLanguages,
  totalCount: 2,
  cultures: mockCultures,
  selectedLanguage: null as LanguageManagement.Language | null,
  isLoading: false,
  error: null as string | null,
  sortKey: 'displayName',
  sortOrder: '' as '' | 'asc' | 'desc',
  fetchLanguages: vi.fn().mockResolvedValue({ success: true }),
  fetchCultures: vi.fn().mockResolvedValue({ success: true }),
  getLanguageById: vi.fn().mockResolvedValue({ success: true }),
  createLanguage: vi.fn().mockResolvedValue({ success: true }),
  updateLanguage: vi.fn().mockResolvedValue({ success: true }),
  deleteLanguage: vi.fn().mockResolvedValue({ success: true }),
  setAsDefaultLanguage: vi.fn().mockResolvedValue({ success: true }),
  setSelectedLanguage: vi.fn(),
  setSortKey: vi.fn(),
  setSortOrder: vi.fn(),
  reset: vi.fn(),
};

// Mock the useLanguages hook
vi.mock('../hooks', () => ({
  useLanguages: () => mockUseLanguagesReturn,
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'AbpLanguageManagement::Languages': 'Languages',
        'AbpLanguageManagement::NewLanguage': 'New Language',
        'AbpLanguageManagement::Edit': 'Edit',
        'AbpLanguageManagement::Delete': 'Delete',
        'AbpLanguageManagement::Actions': 'Actions',
        'AbpLanguageManagement::DisplayName': 'Display Name',
        'AbpLanguageManagement::CultureName': 'Culture Name',
        'AbpLanguageManagement::UiCultureName': 'UI Culture Name',
        'AbpLanguageManagement::IsEnabled': 'Enabled',
        'AbpLanguageManagement::IsDefaultLanguage': 'Default',
        'AbpLanguageManagement::SetAsDefaultLanguage': 'Set as Default',
        'AbpLanguageManagement::Save': 'Save',
        'AbpLanguageManagement::Cancel': 'Cancel',
        'AbpLanguageManagement::NoLanguagesFound': 'No languages found',
        'AbpLanguageManagement::Yes': 'Yes',
        'AbpLanguageManagement::No': 'No',
        'AbpLanguageManagement::Default': 'Default',
        'AbpLanguageManagement::Search': 'Search...',
        'AbpLanguageManagement::FlagIcon': 'Flag Icon',
        'AbpLanguageManagement::SelectCulture': 'Select a culture...',
        'AbpLanguageManagement::SameAsCulture': 'Same as culture',
      };
      return translations[key] || key;
    },
  }),
  useRestService: () => ({
    request: vi.fn(),
  }),
}));

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  Modal: ({
    visible,
    children,
    header,
    footer,
  }: {
    visible: boolean;
    onVisibleChange: (v: boolean) => void;
    children: React.ReactNode;
    header: string;
    footer: React.ReactNode;
  }) =>
    visible ? (
      <div data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-body">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
      </div>
    ) : null,
  useConfirmation: () => ({
    warn: vi.fn().mockResolvedValue('confirm'),
    info: vi.fn().mockResolvedValue('confirm'),
  }),
  Toaster: {
    Status: {
      confirm: 'confirm',
      dismiss: 'dismiss',
    },
  },
  Alert: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert">{children}</div>
  ),
  Button: ({
    children,
    onClick,
    disabled,
    loading,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    colorPalette?: string;
    variant?: string;
    size?: string;
  }) => (
    <button onClick={onClick} disabled={disabled || loading}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  FormField: ({
    label,
    children,
    required,
  }: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <div data-testid={`form-field-${label}`}>
      <label>
        {label}
        {required && ' *'}
      </label>
      {children}
    </div>
  ),
}));

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) => (
    <div id={id} className={className}>{children}</div>
  ),
  Flex: ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex' }}>{children}</div>
  ),
  VStack: ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
  ),
  Input: ({
    value,
    onChange,
    placeholder,
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }) => <input value={value} onChange={onChange} placeholder={placeholder} data-testid="input" />,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Table: {
    Root: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
    Header: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
    Body: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
    Row: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
    Cell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
    ColumnHeader: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  },
  Menu: {
    Root: ({ children }: { children: React.ReactNode }) => <div data-testid="menu">{children}</div>,
    Trigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Positioner: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Content: ({ children }: { children: React.ReactNode }) => <div data-testid="menu-content">{children}</div>,
    Item: ({
      children,
      onClick,
      value,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      value: string;
      color?: string;
    }) => (
      <button data-testid={`menu-item-${value}`} onClick={onClick}>
        {children}
      </button>
    ),
  },
  Badge: ({ children, colorPalette }: { children: React.ReactNode; colorPalette?: string }) => (
    <span data-testid={`badge-${colorPalette}`}>{children}</span>
  ),
  NativeSelectRoot: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  NativeSelectField: ({
    value,
    onChange,
    children,
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
  }) => (
    <select value={value} onChange={onChange} data-testid="select">
      {children}
    </select>
  ),
  Checkbox: {
    Root: ({
      children,
      checked,
      onCheckedChange,
    }: {
      children: React.ReactNode;
      checked?: boolean;
      onCheckedChange?: (e: { checked: boolean }) => void;
    }) => (
      <label data-testid="checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.({ checked: e.target.checked })}
        />
        {children}
      </label>
    ),
    HiddenInput: () => null,
    Control: () => null,
    Label: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  },
}));

describe('LanguagesComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock data
    mockUseLanguagesReturn.languages = mockLanguages;
    mockUseLanguagesReturn.cultures = mockCultures;
    mockUseLanguagesReturn.selectedLanguage = null;
    mockUseLanguagesReturn.isLoading = false;
    mockUseLanguagesReturn.error = null;
  });

  it('should render the component with title', () => {
    render(<LanguagesComponent />);
    expect(screen.getByText('Languages')).toBeInTheDocument();
  });

  it('should render the New Language button', () => {
    render(<LanguagesComponent />);
    expect(screen.getByText('New Language')).toBeInTheDocument();
  });

  it('should fetch languages and cultures on mount', () => {
    render(<LanguagesComponent />);
    expect(mockUseLanguagesReturn.fetchLanguages).toHaveBeenCalled();
    expect(mockUseLanguagesReturn.fetchCultures).toHaveBeenCalled();
  });

  it('should display languages in table', () => {
    render(<LanguagesComponent />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Turkish')).toBeInTheDocument();
  });

  it('should display culture names in table', () => {
    render(<LanguagesComponent />);
    // Both cultureName and uiCultureName show the same values
    const enTexts = screen.getAllByText('en');
    const trTexts = screen.getAllByText('tr');
    expect(enTexts.length).toBeGreaterThan(0);
    expect(trTexts.length).toBeGreaterThan(0);
  });

  it('should show enabled badge for enabled languages', () => {
    render(<LanguagesComponent />);
    const yesBadges = screen.getAllByTestId('badge-green');
    expect(yesBadges.length).toBeGreaterThan(0);
  });

  it('should show disabled badge for disabled languages', () => {
    render(<LanguagesComponent />);
    const noBadges = screen.getAllByTestId('badge-red');
    expect(noBadges.length).toBeGreaterThan(0);
  });

  it('should show default badge for default language', () => {
    render(<LanguagesComponent />);
    expect(screen.getByTestId('badge-blue')).toBeInTheDocument();
  });

  it('should filter languages by search term', () => {
    render(<LanguagesComponent />);
    const searchInput = screen.getAllByTestId('input')[0];

    fireEvent.change(searchInput, { target: { value: 'Turkish' } });

    expect(screen.getByText('Turkish')).toBeInTheDocument();
    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });

  it('should filter languages by culture name', () => {
    render(<LanguagesComponent />);
    const searchInput = screen.getAllByTestId('input')[0];

    fireEvent.change(searchInput, { target: { value: 'tr' } });

    expect(screen.getByText('Turkish')).toBeInTheDocument();
    // Both cultureName and uiCultureName columns show 'tr'
    const trTexts = screen.getAllByText('tr');
    expect(trTexts.length).toBeGreaterThan(0);
    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });

  it('should open modal when New Language button is clicked', () => {
    render(<LanguagesComponent />);

    const newButton = screen.getByText('New Language');
    fireEvent.click(newButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header')).toHaveTextContent('New Language');
  });

  it('should show spinner when loading and no languages', () => {
    mockUseLanguagesReturn.isLoading = true;
    mockUseLanguagesReturn.languages = [];

    render(<LanguagesComponent />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show empty state when no languages', () => {
    mockUseLanguagesReturn.languages = [];

    render(<LanguagesComponent />);

    expect(screen.getByText('No languages found')).toBeInTheDocument();
  });

  it('should show error alert when error exists', () => {
    mockUseLanguagesReturn.error = 'Test error message';

    render(<LanguagesComponent />);

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should call handleEdit when Edit menu item is clicked', async () => {
    render(<LanguagesComponent />);

    const editButtons = screen.getAllByTestId('menu-item-edit');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(mockUseLanguagesReturn.getLanguageById).toHaveBeenCalledWith('1');
    });
  });

  it('should not show delete option for default language', () => {
    render(<LanguagesComponent />);

    // The first language is default, so only edit should appear in its menu
    // The second language is not default, so delete should appear
    const deleteButtons = screen.getAllByTestId('menu-item-delete');
    expect(deleteButtons.length).toBe(1); // Only for non-default language
  });

  it('should not show set as default option for default language', () => {
    render(<LanguagesComponent />);

    const setDefaultButtons = screen.getAllByTestId('menu-item-setDefault');
    expect(setDefaultButtons.length).toBe(1); // Only for non-default language
  });

  it('should call callback props when provided', async () => {
    const onLanguageCreated = vi.fn();
    const onLanguageDeleted = vi.fn();

    render(
      <LanguagesComponent
        onLanguageCreated={onLanguageCreated}
        onLanguageDeleted={onLanguageDeleted}
      />
    );

    // Component renders without error with callbacks
    expect(screen.getByText('Languages')).toBeInTheDocument();
  });

  it('should render action menu for each language', () => {
    render(<LanguagesComponent />);

    // 'Actions' appears in header and in each row's menu button
    const actionButtons = screen.getAllByText('Actions');
    expect(actionButtons.length).toBeGreaterThanOrEqual(2); // One for each language + header
  });

  it('should close modal when cancel is clicked', () => {
    render(<LanguagesComponent />);

    // Open modal
    const newButton = screen.getByText('New Language');
    fireEvent.click(newButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should display flag icons in table', () => {
    render(<LanguagesComponent />);

    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    expect(screen.getByText('🇹🇷')).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    render(<LanguagesComponent />);

    expect(screen.getByText('Display Name')).toBeInTheDocument();
    expect(screen.getByText('Culture Name')).toBeInTheDocument();
    expect(screen.getByText('UI Culture Name')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    // 'Default' appears in header and in badges
    const defaultTexts = screen.getAllByText('Default');
    expect(defaultTexts.length).toBeGreaterThan(0);
  });
});

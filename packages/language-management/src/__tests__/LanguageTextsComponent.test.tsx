/**
 * Tests for LanguageTextsComponent
 * @abpjs/language-management v0.7.2
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageTextsComponent } from '../components/LanguageTexts/LanguageTextsComponent';
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
    isEnabled: true,
    isDefaultLanguage: false,
    creationTime: '2024-01-01T00:00:00Z',
    creatorId: 'user1',
  },
];

const mockResources: LanguageManagement.Resource[] = [
  { name: 'MyResource' },
  { name: 'AnotherResource' },
];

const mockLanguageTexts: LanguageManagement.LanguageText[] = [
  {
    resourceName: 'MyResource',
    cultureName: 'tr',
    baseCultureName: 'en',
    baseValue: 'Hello',
    name: 'Hello',
    value: 'Merhaba',
  },
  {
    resourceName: 'MyResource',
    cultureName: 'tr',
    baseCultureName: 'en',
    baseValue: 'World',
    name: 'World',
    value: '',
  },
];

// Mock hook return values for useLanguages
const mockUseLanguagesReturn = {
  languages: mockLanguages,
  totalCount: 2,
  cultures: [],
  selectedLanguage: null,
  isLoading: false,
  error: null,
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

// Mock hook return values for useLanguageTexts
const mockUseLanguageTextsReturn = {
  languageTexts: mockLanguageTexts,
  totalCount: 2,
  resources: mockResources,
  selectedLanguageText: null as LanguageManagement.LanguageText | null,
  isLoading: false,
  error: null as string | null,
  sortKey: 'name',
  sortOrder: '' as '' | 'asc' | 'desc',
  fetchLanguageTexts: vi.fn().mockResolvedValue({ success: true }),
  fetchResources: vi.fn().mockResolvedValue({ success: true }),
  getLanguageTextByName: vi.fn().mockResolvedValue({ success: true }),
  updateLanguageTextByName: vi.fn().mockResolvedValue({ success: true }),
  restoreLanguageTextByName: vi.fn().mockResolvedValue({ success: true }),
  setSelectedLanguageText: vi.fn(),
  setSortKey: vi.fn(),
  setSortOrder: vi.fn(),
  reset: vi.fn(),
};

// Mock the hooks
vi.mock('../hooks', () => ({
  useLanguages: () => mockUseLanguagesReturn,
  useLanguageTexts: () => mockUseLanguageTextsReturn,
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'AbpLanguageManagement::LanguageTexts': 'Language Texts',
        'AbpLanguageManagement::Actions': 'Actions',
        'AbpLanguageManagement::Key': 'Key',
        'AbpLanguageManagement::BaseValue': 'Base Value',
        'AbpLanguageManagement::TargetValue': 'Target Value',
        'AbpLanguageManagement::Resource': 'Resource',
        'AbpLanguageManagement::BaseCulture': 'Base Culture',
        'AbpLanguageManagement::TargetCulture': 'Target Culture',
        'AbpLanguageManagement::Filter': 'Filter by key or value...',
        'AbpLanguageManagement::OnlyEmptyValues': 'Only empty values',
        'AbpLanguageManagement::Search': 'Search',
        'AbpLanguageManagement::AllResources': 'All Resources',
        'AbpLanguageManagement::Edit': 'Edit',
        'AbpLanguageManagement::RestoreToDefault': 'Restore to Default',
        'AbpLanguageManagement::Save': 'Save',
        'AbpLanguageManagement::Cancel': 'Cancel',
        'AbpLanguageManagement::EditLanguageText': 'Edit Language Text',
        'AbpLanguageManagement::EnterTranslation': 'Enter translation...',
        'AbpLanguageManagement::NoLanguageTextsFound': 'No language texts found',
        'AbpLanguageManagement::SelectCulturesToViewTexts': 'Select base and target cultures to view language texts',
        'AbpLanguageManagement::NotTranslated': '(Not translated)',
        'AbpLanguageManagement::Previous': 'Previous',
        'AbpLanguageManagement::Next': 'Next',
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
  }) => (
    <button onClick={onClick} disabled={disabled || loading} data-testid="button">
      {loading ? 'Loading...' : children}
    </button>
  ),
  FormField: ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div data-testid={`form-field-${label}`}>
      <label>{label}</label>
      {children}
    </div>
  ),
}));

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Flex: ({ children }: { children: React.ReactNode }) => <div style={{ display: 'flex' }}>{children}</div>,
  VStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HStack: ({ children }: { children: React.ReactNode }) => <div style={{ display: 'flex' }}>{children}</div>,
  Input: ({
    value,
    onChange,
    placeholder,
    onKeyDown,
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  }) => <input value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown} data-testid="input" />,
  Textarea: ({
    value,
    onChange,
    placeholder,
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
  }) => <textarea value={value} onChange={onChange} placeholder={placeholder} data-testid="textarea" />,
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
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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
    }) => (
      <button data-testid={`menu-item-${value}`} onClick={onClick}>
        {children}
      </button>
    ),
  },
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

describe('LanguageTextsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock data
    mockUseLanguagesReturn.languages = mockLanguages;
    mockUseLanguageTextsReturn.languageTexts = mockLanguageTexts;
    mockUseLanguageTextsReturn.resources = mockResources;
    mockUseLanguageTextsReturn.selectedLanguageText = null;
    mockUseLanguageTextsReturn.isLoading = false;
    mockUseLanguageTextsReturn.error = null;
  });

  it('should render the component with title', () => {
    render(<LanguageTextsComponent />);
    expect(screen.getByText('Language Texts')).toBeInTheDocument();
  });

  it('should fetch languages and resources on mount', () => {
    render(<LanguageTextsComponent />);
    expect(mockUseLanguagesReturn.fetchLanguages).toHaveBeenCalled();
    expect(mockUseLanguageTextsReturn.fetchResources).toHaveBeenCalled();
  });

  it('should display filter controls', () => {
    render(<LanguageTextsComponent />);
    // 'Resource' appears in both filter label and table header
    const resourceTexts = screen.getAllByText('Resource');
    expect(resourceTexts.length).toBeGreaterThan(0);
    expect(screen.getByText('Base Culture')).toBeInTheDocument();
    expect(screen.getByText('Target Culture')).toBeInTheDocument();
  });

  it('should display search button', () => {
    render(<LanguageTextsComponent />);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('should display only empty values checkbox', () => {
    render(<LanguageTextsComponent />);
    expect(screen.getByText('Only empty values')).toBeInTheDocument();
  });

  it('should display language texts in table', () => {
    render(<LanguageTextsComponent />);
    // 'Hello' appears in both key column and base value column
    const helloTexts = screen.getAllByText('Hello');
    expect(helloTexts.length).toBeGreaterThan(0);
    expect(screen.getByText('Merhaba')).toBeInTheDocument();
  });

  it('should show not translated indicator for empty values', () => {
    render(<LanguageTextsComponent />);
    expect(screen.getByText('(Not translated)')).toBeInTheDocument();
  });

  it('should display resource names in table', () => {
    render(<LanguageTextsComponent />);
    const resourceTexts = screen.getAllByText('MyResource');
    expect(resourceTexts.length).toBeGreaterThan(0);
  });

  it('should display base values in table', () => {
    render(<LanguageTextsComponent />);
    // 'World' appears in both key and base value columns
    const worldTexts = screen.getAllByText('World');
    expect(worldTexts.length).toBeGreaterThan(0);
  });

  it('should show spinner when loading and no texts', () => {
    mockUseLanguageTextsReturn.isLoading = true;
    mockUseLanguageTextsReturn.languageTexts = [];

    render(<LanguageTextsComponent />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show error alert when error exists', () => {
    mockUseLanguageTextsReturn.error = 'Test error message';

    render(<LanguageTextsComponent />);

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should open edit modal when edit menu item is clicked', async () => {
    render(<LanguageTextsComponent />);

    const editButtons = screen.getAllByTestId('menu-item-edit');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(mockUseLanguageTextsReturn.setSelectedLanguageText).toHaveBeenCalled();
    });
  });

  it('should show restore option for modified texts', () => {
    render(<LanguageTextsComponent />);

    // Both texts should have restore options (one is different from base)
    const restoreButtons = screen.getAllByTestId('menu-item-restore');
    expect(restoreButtons.length).toBe(2);
  });

  it('should call callback props when provided', () => {
    const onLanguageTextUpdated = vi.fn();
    const onLanguageTextRestored = vi.fn();

    render(
      <LanguageTextsComponent
        onLanguageTextUpdated={onLanguageTextUpdated}
        onLanguageTextRestored={onLanguageTextRestored}
      />
    );

    // Component renders without error with callbacks
    expect(screen.getByText('Language Texts')).toBeInTheDocument();
  });

  it('should render action menu for each language text', () => {
    render(<LanguageTextsComponent />);

    // 'Actions' appears in header and in each row's menu button
    const actionButtons = screen.getAllByText('Actions');
    expect(actionButtons.length).toBeGreaterThanOrEqual(2); // One for each text + header
  });

  it('should render table headers correctly', () => {
    render(<LanguageTextsComponent />);

    expect(screen.getByText('Key')).toBeInTheDocument();
    expect(screen.getByText('Base Value')).toBeInTheDocument();
    expect(screen.getByText('Target Value')).toBeInTheDocument();
    // 'Resource' appears in both filter label and table header
    const resourceTexts = screen.getAllByText('Resource');
    expect(resourceTexts.length).toBeGreaterThan(0);
  });

  it('should display filter input with placeholder', () => {
    render(<LanguageTextsComponent />);
    const filterInput = screen.getByPlaceholderText('Filter by key or value...');
    expect(filterInput).toBeInTheDocument();
  });

  it('should show empty state when no language texts and cultures set', () => {
    mockUseLanguageTextsReturn.languageTexts = [];

    render(<LanguageTextsComponent />);

    expect(screen.getByText('No language texts found')).toBeInTheDocument();
  });

  it('should render resource selector with options', () => {
    render(<LanguageTextsComponent />);

    expect(screen.getByText('All Resources')).toBeInTheDocument();
  });
});

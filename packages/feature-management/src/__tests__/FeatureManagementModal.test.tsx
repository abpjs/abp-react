import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock @abpjs/core BEFORE other imports
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'AbpTenantManagement::Permission:ManageFeatures': 'Manage Features',
        'AbpFeatureManagement::Cancel': 'Cancel',
        'AbpFeatureManagement::Save': 'Save',
        'AbpFeatureManagement::NoFeatures': 'No features available',
      };
      return translations[key] || key;
    },
  }),
  useRestService: () => ({}),
}));

// Mock feature data
const mockFeatures = [
  {
    name: 'Feature.EnableChat',
    value: 'true',
    description: 'Enable chat functionality',
    valueType: {
      name: 'ToggleStringValueType',
      properties: {},
      validator: {},
    },
    depth: 0,
    parentName: '',
  },
  {
    name: 'Feature.MaxUsers',
    value: '100',
    description: 'Maximum number of users',
    valueType: {
      name: 'FreeTextStringValueType',
      properties: {},
      validator: {},
    },
    depth: 0,
    parentName: '',
  },
  {
    name: 'Feature.DefaultTheme',
    value: 'dark',
    description: 'Default theme',
    valueType: {
      name: 'SelectionStringValueType',
      properties: {},
      validator: {},
    },
    depth: 0,
    parentName: '',
  },
];

// Mock hook state
const mockFetchFeatures = vi.fn();
const mockSaveFeatures = vi.fn();
const mockUpdateFeatureValue = vi.fn();
const mockGetFeatureValue = vi.fn();
const mockIsFeatureEnabled = vi.fn();
const mockReset = vi.fn();

const mockUseFeatureManagement = vi.fn(() => ({
  features: mockFeatures,
  featureValues: {
    'Feature.EnableChat': 'true',
    'Feature.MaxUsers': '100',
    'Feature.DefaultTheme': 'dark',
  },
  isLoading: false,
  error: null,
  fetchFeatures: mockFetchFeatures,
  saveFeatures: mockSaveFeatures,
  updateFeatureValue: mockUpdateFeatureValue,
  getFeatureValue: mockGetFeatureValue,
  isFeatureEnabled: mockIsFeatureEnabled,
  reset: mockReset,
}));

// Mock hooks - use full path from component's perspective
vi.mock('../hooks', () => ({
  useFeatureManagement: () => mockUseFeatureManagement(),
}));

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  Modal: ({ visible, children, header, footer, onVisibleChange: _onVisibleChange }: any) =>
    visible ? (
      <div data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-body">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
      </div>
    ) : null,
  Alert: ({ children, status }: any) => (
    <div data-testid="alert" data-status={status}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, loading, disabled, variant, colorPalette, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      data-loading={loading}
      data-variant={variant}
      data-colorpalette={colorPalette}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  ),
  Checkbox: ({ children, checked, onChange, id }: any) => (
    <label>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        data-testid={`checkbox-${id}`}
      />
      {children}
    </label>
  ),
}));

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, w, ...props }: any) => (
    <div data-w={w} {...props}>
      {children}
    </div>
  ),
  Flex: ({ children, justify: _justify, align: _align, gap: _gap, py: _py, ...props }: any) => (
    <div data-testid="flex" {...props}>
      {children}
    </div>
  ),
  Input: React.forwardRef(({ id, value, onChange, placeholder, ...props }: any, ref: any) => (
    <input
      ref={ref}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid={`input-${id}`}
      {...props}
    />
  )),
  Spinner: ({ size }: any) => <div data-testid="spinner" data-size={size}>Loading...</div>,
  VStack: ({ children, align: _align, gap: _gap, ...props }: any) => (
    <div data-testid="vstack" {...props}>
      {children}
    </div>
  ),
  Text: ({ children, fontWeight, color, ...props }: any) => (
    <span data-fontweight={fontWeight} data-color={color} {...props}>
      {children}
    </span>
  ),
}));

import { FeatureManagementModal } from '../components/FeatureManagementModal/FeatureManagementModal';

describe('FeatureManagementModal', () => {
  const user = userEvent.setup();

  const defaultProps = {
    providerName: 'T',
    providerKey: 'tenant-123',
    visible: true,
    onVisibleChange: vi.fn(),
    onSave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchFeatures.mockResolvedValue({ success: true });
    mockSaveFeatures.mockResolvedValue({ success: true });
    mockGetFeatureValue.mockImplementation((name: string) => {
      const values: Record<string, string> = {
        'Feature.EnableChat': 'true',
        'Feature.MaxUsers': '100',
        'Feature.DefaultTheme': 'dark',
      };
      return values[name] || '';
    });
    mockIsFeatureEnabled.mockImplementation((name: string) => {
      return name === 'Feature.EnableChat';
    });
    mockUseFeatureManagement.mockReturnValue({
      features: mockFeatures,
      featureValues: {
        'Feature.EnableChat': 'true',
        'Feature.MaxUsers': '100',
        'Feature.DefaultTheme': 'dark',
      },
      isLoading: false,
      error: null,
      fetchFeatures: mockFetchFeatures,
      saveFeatures: mockSaveFeatures,
      updateFeatureValue: mockUpdateFeatureValue,
      getFeatureValue: mockGetFeatureValue,
      isFeatureEnabled: mockIsFeatureEnabled,
      reset: mockReset,
    });
  });

  it('should render modal when visible is true', () => {
    render(<FeatureManagementModal {...defaultProps} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header')).toHaveTextContent('Manage Features');
  });

  it('should not render modal when visible is false', () => {
    render(<FeatureManagementModal {...defaultProps} visible={false} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should fetch features when modal opens', () => {
    render(<FeatureManagementModal {...defaultProps} />);

    expect(mockFetchFeatures).toHaveBeenCalledWith('tenant-123', 'T');
  });

  it('should reset state when modal closes', () => {
    const { rerender } = render(<FeatureManagementModal {...defaultProps} visible={true} />);

    rerender(<FeatureManagementModal {...defaultProps} visible={false} />);

    expect(mockReset).toHaveBeenCalled();
  });

  it('should render Cancel and Save buttons', () => {
    render(<FeatureManagementModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should call onVisibleChange when Cancel is clicked', async () => {
    render(<FeatureManagementModal {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(defaultProps.onVisibleChange).toHaveBeenCalledWith(false);
  });

  it('should call saveFeatures when Save is clicked', async () => {
    render(<FeatureManagementModal {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockSaveFeatures).toHaveBeenCalledWith('tenant-123', 'T');
    });
  });

  it('should call onSave and close modal on successful save', async () => {
    render(<FeatureManagementModal {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalled();
      expect(defaultProps.onVisibleChange).toHaveBeenCalledWith(false);
    });
  });

  it('should not close modal on failed save', async () => {
    mockSaveFeatures.mockResolvedValue({ success: false, error: 'Save failed' });

    render(<FeatureManagementModal {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(defaultProps.onVisibleChange).not.toHaveBeenCalledWith(false);
    });
  });

  it('should render features list', () => {
    render(<FeatureManagementModal {...defaultProps} />);

    expect(screen.getByText('Feature.EnableChat')).toBeInTheDocument();
    expect(screen.getByText('Feature.MaxUsers')).toBeInTheDocument();
    expect(screen.getByText('Feature.DefaultTheme')).toBeInTheDocument();
  });

  it('should render checkbox for toggle features', () => {
    render(<FeatureManagementModal {...defaultProps} />);

    const checkbox = screen.getByTestId('checkbox-feature-0');
    expect(checkbox).toBeInTheDocument();
  });

  it('should render input for free text features', () => {
    render(<FeatureManagementModal {...defaultProps} />);

    const input = screen.getByTestId('input-feature-1');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('100');
  });

  it('should call updateFeatureValue when checkbox is toggled', async () => {
    render(<FeatureManagementModal {...defaultProps} />);

    const checkbox = screen.getByTestId('checkbox-feature-0');
    await user.click(checkbox);

    expect(mockUpdateFeatureValue).toHaveBeenCalledWith('Feature.EnableChat', 'false');
  });

  it('should call updateFeatureValue when text input changes', async () => {
    render(<FeatureManagementModal {...defaultProps} />);

    const input = screen.getByTestId('input-feature-1');
    await user.clear(input);
    await user.type(input, '200');

    expect(mockUpdateFeatureValue).toHaveBeenCalled();
  });

  it('should show loading spinner when loading with no features', () => {
    mockUseFeatureManagement.mockReturnValue({
      features: [],
      featureValues: {},
      isLoading: true,
      error: null,
      fetchFeatures: mockFetchFeatures,
      saveFeatures: mockSaveFeatures,
      updateFeatureValue: mockUpdateFeatureValue,
      getFeatureValue: mockGetFeatureValue,
      isFeatureEnabled: mockIsFeatureEnabled,
      reset: mockReset,
    });

    render(<FeatureManagementModal {...defaultProps} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show error alert when there is an error', () => {
    mockUseFeatureManagement.mockReturnValue({
      features: [],
      featureValues: {},
      isLoading: false,
      error: 'Failed to load features',
      fetchFeatures: mockFetchFeatures,
      saveFeatures: mockSaveFeatures,
      updateFeatureValue: mockUpdateFeatureValue,
      getFeatureValue: mockGetFeatureValue,
      isFeatureEnabled: mockIsFeatureEnabled,
      reset: mockReset,
    });

    render(<FeatureManagementModal {...defaultProps} />);

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to load features')).toBeInTheDocument();
  });

  it('should show empty state when no features available', () => {
    mockUseFeatureManagement.mockReturnValue({
      features: [],
      featureValues: {},
      isLoading: false,
      error: null,
      fetchFeatures: mockFetchFeatures,
      saveFeatures: mockSaveFeatures,
      updateFeatureValue: mockUpdateFeatureValue,
      getFeatureValue: mockGetFeatureValue,
      isFeatureEnabled: mockIsFeatureEnabled,
      reset: mockReset,
    });

    render(<FeatureManagementModal {...defaultProps} />);

    expect(screen.getByText('No features available')).toBeInTheDocument();
  });

  it('should disable Cancel button while loading', () => {
    mockUseFeatureManagement.mockReturnValue({
      features: mockFeatures,
      featureValues: {},
      isLoading: true,
      error: null,
      fetchFeatures: mockFetchFeatures,
      saveFeatures: mockSaveFeatures,
      updateFeatureValue: mockUpdateFeatureValue,
      getFeatureValue: mockGetFeatureValue,
      isFeatureEnabled: mockIsFeatureEnabled,
      reset: mockReset,
    });

    render(<FeatureManagementModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('should show loading state on Save button while saving', () => {
    mockUseFeatureManagement.mockReturnValue({
      features: mockFeatures,
      featureValues: {},
      isLoading: true,
      error: null,
      fetchFeatures: mockFetchFeatures,
      saveFeatures: mockSaveFeatures,
      updateFeatureValue: mockUpdateFeatureValue,
      getFeatureValue: mockGetFeatureValue,
      isFeatureEnabled: mockIsFeatureEnabled,
      reset: mockReset,
    });

    render(<FeatureManagementModal {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: 'Loading...' });
    expect(saveButton).toHaveAttribute('data-loading', 'true');
  });

  it('should toggle feature from true to false', async () => {
    mockGetFeatureValue.mockImplementation((name: string) => {
      if (name === 'Feature.EnableChat') return 'true';
      return '';
    });

    render(<FeatureManagementModal {...defaultProps} />);

    const checkbox = screen.getByTestId('checkbox-feature-0');
    await user.click(checkbox);

    expect(mockUpdateFeatureValue).toHaveBeenCalledWith('Feature.EnableChat', 'false');
  });

  it('should toggle feature from false to true', async () => {
    mockGetFeatureValue.mockImplementation((name: string) => {
      if (name === 'Feature.EnableChat') return 'false';
      return '';
    });

    render(<FeatureManagementModal {...defaultProps} />);

    const checkbox = screen.getByTestId('checkbox-feature-0');
    await user.click(checkbox);

    expect(mockUpdateFeatureValue).toHaveBeenCalledWith('Feature.EnableChat', 'true');
  });

  it('should toggle feature with "True" (capitalized) value', async () => {
    mockGetFeatureValue.mockImplementation((name: string) => {
      if (name === 'Feature.EnableChat') return 'True';
      return '';
    });

    render(<FeatureManagementModal {...defaultProps} />);

    const checkbox = screen.getByTestId('checkbox-feature-0');
    await user.click(checkbox);

    expect(mockUpdateFeatureValue).toHaveBeenCalledWith('Feature.EnableChat', 'false');
  });

  it('should not fetch features when providerKey is empty', () => {
    render(<FeatureManagementModal {...defaultProps} providerKey="" />);

    expect(mockFetchFeatures).not.toHaveBeenCalled();
  });

  it('should not fetch features when providerName is empty', () => {
    render(<FeatureManagementModal {...defaultProps} providerName="" />);

    expect(mockFetchFeatures).not.toHaveBeenCalled();
  });

  it('should render default input for unknown value types', () => {
    const featuresWithUnknownType = [
      {
        name: 'Feature.Unknown',
        value: 'value',
        description: 'Unknown type feature',
        valueType: {
          name: 'UnknownType',
          properties: {},
          validator: {},
        },
        depth: 0,
        parentName: '',
      },
    ];

    mockUseFeatureManagement.mockReturnValue({
      features: featuresWithUnknownType,
      featureValues: { 'Feature.Unknown': 'value' },
      isLoading: false,
      error: null,
      fetchFeatures: mockFetchFeatures,
      saveFeatures: mockSaveFeatures,
      updateFeatureValue: mockUpdateFeatureValue,
      getFeatureValue: () => 'value',
      isFeatureEnabled: mockIsFeatureEnabled,
      reset: mockReset,
    });

    render(<FeatureManagementModal {...defaultProps} />);

    const input = screen.getByTestId('input-feature-0');
    expect(input).toBeInTheDocument();
  });

  it('should work without onSave callback', async () => {
    const propsWithoutOnSave = {
      ...defaultProps,
      onSave: undefined,
    };

    render(<FeatureManagementModal {...propsWithoutOnSave} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockSaveFeatures).toHaveBeenCalled();
      expect(defaultProps.onVisibleChange).toHaveBeenCalledWith(false);
    });
  });

  it('should work without onVisibleChange callback', async () => {
    const propsWithoutOnVisibleChange = {
      ...defaultProps,
      onVisibleChange: undefined,
    };

    render(<FeatureManagementModal {...propsWithoutOnVisibleChange} />);

    // Should not throw when Cancel is clicked
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
  });
});

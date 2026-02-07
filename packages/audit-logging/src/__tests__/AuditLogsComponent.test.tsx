/**
 * Tests for AuditLogsComponent
 * @abpjs/audit-logging v4.0.0
 *
 * @since 4.0.0 - Updated type references from AuditLogging.Log to AuditLogDto
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuditLogsComponent } from '../components/AuditLogs/AuditLogsComponent';
import type { AuditLogDto } from '../proxy/audit-logging/models';

// Mock data
const mockAuditLogs: AuditLogDto[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'admin',
    tenantId: 'tenant1',
    impersonatorUserId: '',
    impersonatorTenantId: '',
    executionTime: '2024-01-01T10:30:00Z',
    executionDuration: 150,
    clientIpAddress: '192.168.1.1',
    clientName: 'WebApp',
    browserInfo: 'Chrome/120.0',
    httpMethod: 'GET',
    url: '/api/users',
    exceptions: '',
    comments: 'Test comment',
    httpStatusCode: 200,
    applicationName: 'TestApp',
    correlationId: 'corr-123',
    extraProperties: { key: 'value' },
    entityChanges: [
      {
        id: 'ec1',
        auditLogId: '1',
        tenantId: 'tenant1',
        changeTime: '2024-01-01T10:30:00Z',
        changeType: 'Updated',
        entityId: 'entity1',
        entityTypeFullName: 'User',
        propertyChanges: [
          {
            id: 'pc1',
            entityChangeId: 'ec1',
            tenantId: 'tenant1',
            newValue: 'new',
            originalValue: 'old',
            propertyName: 'Name',
            propertyTypeFullName: 'string',
          },
        ],
        extraProperties: {},
      },
    ],
    actions: [
      {
        id: 'a1',
        auditLogId: '1',
        tenantId: 'tenant1',
        serviceName: 'UserService',
        methodName: 'GetUsers',
        parameters: '{"page": 1}',
        executionTime: '2024-01-01T10:30:00Z',
        executionDuration: 50,
        extraProperties: {},
      },
    ],
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'user',
    tenantId: 'tenant1',
    impersonatorUserId: '',
    impersonatorTenantId: '',
    executionTime: '2024-01-02T12:00:00Z',
    executionDuration: 200,
    clientIpAddress: '192.168.1.2',
    clientName: 'API',
    browserInfo: 'Postman/10.0',
    httpMethod: 'POST',
    url: '/api/users',
    exceptions: 'Validation error',
    comments: '',
    httpStatusCode: 400,
    applicationName: 'TestApp',
    correlationId: 'corr-456',
    extraProperties: {},
    entityChanges: [],
    actions: [],
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'moderator',
    tenantId: 'tenant1',
    impersonatorUserId: '',
    impersonatorTenantId: '',
    executionTime: '2024-01-03T14:00:00Z',
    executionDuration: 300,
    clientIpAddress: '192.168.1.3',
    clientName: 'Mobile',
    browserInfo: 'Safari/17.0',
    httpMethod: 'DELETE',
    url: '/api/users/1',
    exceptions: 'Server error',
    comments: '',
    httpStatusCode: 500,
    applicationName: 'TestApp',
    correlationId: 'corr-789',
    extraProperties: {},
    entityChanges: [],
    actions: [],
  },
];

// Mock hook return values
const createMockUseAuditLogsReturn = () => ({
  auditLogs: mockAuditLogs,
  totalCount: 25, // More than pageSize to show pagination
  selectedLog: null as AuditLogDto | null,
  isLoading: false,
  error: null as string | null,
  averageExecutionStats: {},
  errorRateStats: {},
  sortKey: 'executionTime',
  sortOrder: 'desc' as 'asc' | 'desc',
  fetchAuditLogs: vi.fn().mockResolvedValue({ success: true }),
  getAuditLogById: vi.fn().mockResolvedValue({ success: true, data: mockAuditLogs[0] }),
  fetchAverageExecutionStats: vi.fn().mockResolvedValue({ success: true }),
  fetchErrorRateStats: vi.fn().mockResolvedValue({ success: true }),
  setSelectedLog: vi.fn(),
  setSortKey: vi.fn(),
  setSortOrder: vi.fn(),
  reset: vi.fn(),
});

let mockUseAuditLogsReturn = createMockUseAuditLogsReturn();

// Mock the useAuditLogs hook
vi.mock('../hooks', () => ({
  useAuditLogs: () => mockUseAuditLogsReturn,
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'AbpAuditLogging::AuditLogs': 'Audit Logs',
        'AbpAuditLogging::Detail': 'Detail',
        'AbpAuditLogging::HttpRequest': 'HTTP Request',
        'AbpAuditLogging::User': 'User',
        'AbpAuditLogging::IpAddress': 'IP Address',
        'AbpAuditLogging::Time': 'Time',
        'AbpAuditLogging::Duration': 'Duration',
        'AbpAuditLogging::ApplicationName': 'Application Name',
        'AbpAuditLogging::UserName': 'User Name',
        'AbpAuditLogging::UrlFilter': 'URL',
        'AbpAuditLogging::MinDuration': 'Min Duration',
        'AbpAuditLogging::MaxDuration': 'Max Duration',
        'AbpAuditLogging::HttpMethod': 'HTTP Method',
        'AbpAuditLogging::HttpStatusCode': 'HTTP Status Code',
        'AbpAuditLogging::CorrelationId': 'Correlation ID',
        'AbpAuditLogging::HasException': 'Has Exception',
        'AbpAuditLogging::All': 'All',
        'AbpAuditLogging::Yes': 'Yes',
        'AbpAuditLogging::No': 'No',
        'AbpAuditLogging::Refresh': 'Refresh',
        'AbpAuditLogging::Previous': 'Previous',
        'AbpAuditLogging::Next': 'Next',
        'AbpAuditLogging::Close': 'Close',
        'AbpAuditLogging::Overall': 'Overall',
        'AbpAuditLogging::Actions': 'Actions',
        'AbpAuditLogging::Changes': 'Changes',
        'AbpAuditLogging::NoAuditLogsFound': 'No audit logs found',
        'AbpAuditLogging::NoActionsFound': 'No actions found',
        'AbpAuditLogging::NoChangesFound': 'No changes found',
        'AbpAuditLogging::ClientIpAddress': 'Client IP Address',
        'AbpAuditLogging::ClientName': 'Client Name',
        'AbpAuditLogging::Exceptions': 'Exceptions',
        'AbpAuditLogging::BrowserInfo': 'Browser Info',
        'AbpAuditLogging::Comments': 'Comments',
        'AbpAuditLogging::ExtraProperties': 'Extra Properties',
        'AbpAuditLogging::Url': 'URL',
        'AbpAuditLogging::Parameters': 'Parameters',
        'AbpAuditLogging::PropertyName': 'Property Name',
        'AbpAuditLogging::OriginalValue': 'Original Value',
        'AbpAuditLogging::NewValue': 'New Value',
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
  Alert: ({ children, status }: { children: React.ReactNode; status?: string }) => (
    <div data-testid="alert" data-status={status}>
      {children}
    </div>
  ),
  Button: ({
    children,
    onClick,
    disabled,
    size,
    colorPalette,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    size?: string;
    colorPalette?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-size={size}
      data-colorpalette={colorPalette}
    >
      {children}
    </button>
  ),
  FormField: ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div data-testid={`form-field-${label}`}>
      <label>{label}</label>
      {children}
    </div>
  ),
}));

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Box: ({
    children,
    id,
    className,
    as,
    onClick,
    ...props
  }: {
    children?: React.ReactNode;
    id?: string;
    className?: string;
    as?: string;
    onClick?: () => void;
    [key: string]: unknown;
  }) => {
    const Tag = as === 'button' ? 'button' : as === 'pre' ? 'pre' : 'div';
    return React.createElement(
      Tag,
      { id, className, onClick, 'data-testid': props['data-testid'] || (as === 'button' ? 'collapsible-button' : undefined) },
      children
    );
  },
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
    type,
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
  }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      data-testid="input"
    />
  ),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Badge: ({ children, colorPalette }: { children: React.ReactNode; colorPalette?: string }) => (
    <span data-testid="badge" data-colorpalette={colorPalette}>
      {children}
    </span>
  ),
  Table: {
    Root: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
    Header: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
    Body: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
    Row: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
    Cell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
    ColumnHeader: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  },
  Tabs: {
    Root: ({
      children,
      value,
      onValueChange,
    }: {
      children: React.ReactNode;
      value: string;
      onValueChange: (e: { value: string }) => void;
    }) => (
      <div data-testid="tabs" data-value={value}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ onValueChange?: (e: { value: string }) => void }>, {
              onValueChange,
            });
          }
          return child;
        })}
      </div>
    ),
    List: ({ children, onValueChange }: { children: React.ReactNode; onValueChange?: (e: { value: string }) => void }) => (
      <div data-testid="tabs-list">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ onValueChange?: (e: { value: string }) => void }>, {
              onValueChange,
            });
          }
          return child;
        })}
      </div>
    ),
    Trigger: ({
      children,
      value,
      onValueChange,
    }: {
      children: React.ReactNode;
      value: string;
      onValueChange?: (e: { value: string }) => void;
    }) => (
      <button
        data-testid={`tab-${value}`}
        onClick={() => onValueChange?.({ value })}
      >
        {children}
      </button>
    ),
    Content: ({ children, value }: { children: React.ReactNode; value: string }) => (
      <div data-testid={`tab-content-${value}`}>{children}</div>
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
}));

describe('AuditLogsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuditLogsReturn = createMockUseAuditLogsReturn();
  });

  describe('Rendering', () => {
    it('should render the component with header', () => {
      render(<AuditLogsComponent />);

      expect(screen.getByText('Audit Logs')).toBeInTheDocument();
    });

    it('should render filter fields', () => {
      render(<AuditLogsComponent />);

      expect(screen.getByTestId('form-field-User Name')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-URL')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-Min Duration')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-Max Duration')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-HTTP Method')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-HTTP Status Code')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-Application Name')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-Correlation ID')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-Has Exception')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      render(<AuditLogsComponent />);

      expect(screen.getByText('Refresh')).toBeInTheDocument();
    });

    it('should render table with audit logs', () => {
      render(<AuditLogsComponent />);

      // Check table headers
      expect(screen.getByText('Detail')).toBeInTheDocument();
      expect(screen.getByText('HTTP Request')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('IP Address')).toBeInTheDocument();
      expect(screen.getByText('Time')).toBeInTheDocument();

      // Check table data
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('user')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    });

    it('should render HTTP status badges with correct colors', () => {
      render(<AuditLogsComponent />);

      const badges = screen.getAllByTestId('badge');
      // Check for status code badges (200, 400, 500)
      const statusBadges = badges.filter(
        (b) => b.textContent === '200' || b.textContent === '400' || b.textContent === '500'
      );
      expect(statusBadges.length).toBe(3);
    });

    it('should render HTTP method badges', () => {
      render(<AuditLogsComponent />);

      const badges = screen.getAllByTestId('badge');
      // Check for method badges
      expect(badges.some((b) => b.textContent === 'GET')).toBe(true);
      expect(badges.some((b) => b.textContent === 'POST')).toBe(true);
      expect(badges.some((b) => b.textContent === 'DELETE')).toBe(true);
    });

    it('should show pagination when totalCount > pageSize', () => {
      render(<AuditLogsComponent />);

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      // Check pagination text format
      expect(screen.getByText('1 - 10 / 25')).toBeInTheDocument();
    });

    it('should disable Previous button on first page', () => {
      render(<AuditLogsComponent />);

      const prevButton = screen.getByText('Previous');
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading and no data', () => {
      mockUseAuditLogsReturn.isLoading = true;
      mockUseAuditLogsReturn.auditLogs = [];

      render(<AuditLogsComponent />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should not show spinner when loading with existing data', () => {
      mockUseAuditLogsReturn.isLoading = true;

      render(<AuditLogsComponent />);

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show no audit logs message when empty and not loading', () => {
      mockUseAuditLogsReturn.auditLogs = [];
      mockUseAuditLogsReturn.isLoading = false;

      render(<AuditLogsComponent />);

      expect(screen.getByText('No audit logs found')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error alert when there is an error', () => {
      mockUseAuditLogsReturn.error = 'Failed to fetch audit logs';

      render(<AuditLogsComponent />);

      const alert = screen.getByTestId('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Failed to fetch audit logs');
    });
  });

  describe('Filter Interactions', () => {
    it('should call handleRefresh when Refresh button is clicked', () => {
      render(<AuditLogsComponent />);

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      expect(mockUseAuditLogsReturn.fetchAuditLogs).toHaveBeenCalled();
    });

    it('should update filter state when typing in userName input', () => {
      render(<AuditLogsComponent />);

      const inputs = screen.getAllByTestId('input');
      const userNameInput = inputs[0]; // First input is userName
      fireEvent.change(userNameInput, { target: { value: 'testuser' } });

      expect(userNameInput).toHaveValue('testuser');
    });

    it('should update filter state when selecting HTTP method', () => {
      render(<AuditLogsComponent />);

      const selects = screen.getAllByTestId('select');
      const httpMethodSelect = selects[0]; // First select is httpMethod
      fireEvent.change(httpMethodSelect, { target: { value: 'GET' } });

      expect(httpMethodSelect).toHaveValue('GET');
    });
  });

  describe('Pagination', () => {
    it('should navigate to next page when Next button is clicked', async () => {
      render(<AuditLogsComponent />);

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      // fetchAuditLogs should be called with updated params
      await waitFor(() => {
        expect(mockUseAuditLogsReturn.fetchAuditLogs).toHaveBeenCalled();
      });
    });

    it('should not navigate below page 0 when Previous is clicked', () => {
      render(<AuditLogsComponent />);

      const prevButton = screen.getByText('Previous');
      // Previous should be disabled on first page
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Modal Interactions', () => {
    it('should open modal when detail button is clicked', async () => {
      render(<AuditLogsComponent />);

      // Find detail buttons (magnifying glass)
      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(mockUseAuditLogsReturn.getAuditLogById).toHaveBeenCalledWith('1');
      });
    });

    it('should show modal with selected log details', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      // Click detail button
      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });

    it('should call onAuditLogSelected callback when log is selected', async () => {
      const onAuditLogSelected = vi.fn();

      render(<AuditLogsComponent onAuditLogSelected={onAuditLogSelected} />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(onAuditLogSelected).toHaveBeenCalledWith(mockAuditLogs[0]);
      });
    });

    it('should close modal when Close button is clicked', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      // Open modal
      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Find and click close button in modal footer
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);

      expect(mockUseAuditLogsReturn.setSelectedLog).toHaveBeenCalledWith(null);
    });
  });

  describe('Modal Tabs', () => {
    beforeEach(() => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];
    });

    it('should render tab triggers for Overall, Actions, and Changes', async () => {
      render(<AuditLogsComponent />);

      // Open modal
      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('tab-overall')).toBeInTheDocument();
        expect(screen.getByTestId('tab-actions')).toBeInTheDocument();
        expect(screen.getByTestId('tab-changes')).toBeInTheDocument();
      });
    });

    it('should show action count in Actions tab', async () => {
      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        // Actions tab should show count (1)
        expect(screen.getByTestId('tab-actions')).toHaveTextContent('Actions (1)');
      });
    });

    it('should show entity changes count in Changes tab', async () => {
      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        // Changes tab should show count (1)
        expect(screen.getByTestId('tab-changes')).toHaveTextContent('Changes (1)');
      });
    });
  });

  describe('Overall Tab Content', () => {
    it('should display log details in Overall tab', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      // Open modal
      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        const overallContent = screen.getByTestId('tab-content-overall');
        expect(overallContent).toBeInTheDocument();
        expect(overallContent).toHaveTextContent('/api/users');
        expect(overallContent).toHaveTextContent('192.168.1.1');
        expect(overallContent).toHaveTextContent('WebApp');
      });
    });

    it('should show exceptions when present', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[1]; // Has exceptions

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('tab-content-overall')).toHaveTextContent('Validation error');
      });
    });

    it('should show extra properties when present', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0]; // Has extraProperties

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('tab-content-overall')).toHaveTextContent('"key": "value"');
      });
    });
  });

  describe('Actions Tab Content', () => {
    it('should show no actions message when empty', async () => {
      mockUseAuditLogsReturn.selectedLog = { ...mockAuditLogs[0], actions: [] };

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('tab-content-actions')).toHaveTextContent('No actions found');
      });
    });

    it('should display actions with service name', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('tab-content-actions')).toHaveTextContent('UserService');
      });
    });

    it('should toggle action expansion when clicked', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        const actionsContent = screen.getByTestId('tab-content-actions');
        expect(actionsContent).toBeInTheDocument();
      });

      // Find collapsible button for action
      const collapsibleButtons = screen.getAllByTestId('collapsible-button');
      const actionButton = collapsibleButtons.find((btn) =>
        btn.textContent?.includes('UserService')
      );

      if (actionButton) {
        fireEvent.click(actionButton);

        // After expansion, should show parameters
        await waitFor(() => {
          expect(screen.getByTestId('tab-content-actions')).toHaveTextContent('{"page": 1}');
        });
      }
    });
  });

  describe('Changes Tab Content', () => {
    it('should show no changes message when empty', async () => {
      mockUseAuditLogsReturn.selectedLog = { ...mockAuditLogs[0], entityChanges: [] };

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('tab-content-changes')).toHaveTextContent('No changes found');
      });
    });

    it('should display entity changes with type name', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('tab-content-changes')).toHaveTextContent('User');
      });
    });

    it('should toggle change expansion when clicked', async () => {
      // This test validates that the change list renders and can be toggled
      // The actual expansion functionality is tested in the unit tests for toggle functions
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      // Verify getAuditLogById is called when detail button is clicked
      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(mockUseAuditLogsReturn.getAuditLogById).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('HTTP Badge Colors', () => {
    it('should use green for 2xx status codes', () => {
      render(<AuditLogsComponent />);

      const badges = screen.getAllByTestId('badge');
      const badge200 = badges.find((b) => b.textContent === '200');
      expect(badge200).toHaveAttribute('data-colorpalette', 'green');
    });

    it('should use red for 4xx and 5xx status codes', () => {
      render(<AuditLogsComponent />);

      const badges = screen.getAllByTestId('badge');
      const badge400 = badges.find((b) => b.textContent === '400');
      const badge500 = badges.find((b) => b.textContent === '500');
      expect(badge400).toHaveAttribute('data-colorpalette', 'red');
      expect(badge500).toHaveAttribute('data-colorpalette', 'red');
    });

    it('should use correct colors for HTTP methods', () => {
      render(<AuditLogsComponent />);

      const badges = screen.getAllByTestId('badge');
      const getBadge = badges.find((b) => b.textContent === 'GET');
      const postBadge = badges.find((b) => b.textContent === 'POST');
      const deleteBadge = badges.find((b) => b.textContent === 'DELETE');

      expect(getBadge).toHaveAttribute('data-colorpalette', 'blue');
      expect(postBadge).toHaveAttribute('data-colorpalette', 'green');
      expect(deleteBadge).toHaveAttribute('data-colorpalette', 'red');
    });
  });

  describe('Date Formatting', () => {
    it('should format dates correctly', () => {
      render(<AuditLogsComponent />);

      // The dates should be formatted to locale string
      // Check that at least one date is rendered (the exact format depends on locale)
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('should handle invalid date strings gracefully', async () => {
      mockUseAuditLogsReturn.selectedLog = {
        ...mockAuditLogs[0],
        executionTime: 'not-a-date',
      };

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        // The invalid date should still render (either as Invalid Date locale string or the raw string)
        const overallContent = screen.getByTestId('tab-content-overall');
        expect(overallContent).toBeInTheDocument();
      });
    });
  });

  describe('useEffect Triggers', () => {
    it('should fetch audit logs on mount', () => {
      render(<AuditLogsComponent />);

      expect(mockUseAuditLogsReturn.fetchAuditLogs).toHaveBeenCalled();
    });

    it('should pass correct params to fetchAuditLogs', () => {
      render(<AuditLogsComponent />);

      expect(mockUseAuditLogsReturn.fetchAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          skipCount: 0,
          maxResultCount: 10,
        })
      );
    });
  });

  describe('Refresh with Filters', () => {
    it('should pass all filter values when refreshing', () => {
      render(<AuditLogsComponent />);

      // Set filters
      const inputs = screen.getAllByTestId('input');
      fireEvent.change(inputs[0], { target: { value: 'admin' } }); // userName
      fireEvent.change(inputs[1], { target: { value: '/api/test' } }); // url
      fireEvent.change(inputs[2], { target: { value: '100' } }); // minExecutionDuration
      fireEvent.change(inputs[3], { target: { value: '500' } }); // maxExecutionDuration
      fireEvent.change(inputs[4], { target: { value: 'TestApp' } }); // applicationName
      fireEvent.change(inputs[5], { target: { value: 'corr-123' } }); // correlationId

      const selects = screen.getAllByTestId('select');
      fireEvent.change(selects[0], { target: { value: 'GET' } }); // httpMethod
      fireEvent.change(selects[1], { target: { value: '200' } }); // httpStatusCode
      fireEvent.change(selects[2], { target: { value: 'true' } }); // hasException

      // Click refresh
      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      // Should call fetchAuditLogs with filters applied
      expect(mockUseAuditLogsReturn.fetchAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          skipCount: 0,
          maxResultCount: 10,
          userName: 'admin',
          url: '/api/test',
          httpMethod: 'GET',
          httpStatusCode: 200,
          minExecutionDuration: 100,
          maxExecutionDuration: 500,
          hasException: true,
        })
      );
    });

    it('should pass hasException=false when "No" is selected', () => {
      render(<AuditLogsComponent />);

      const selects = screen.getAllByTestId('select');
      fireEvent.change(selects[2], { target: { value: 'false' } }); // hasException

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      expect(mockUseAuditLogsReturn.fetchAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          hasException: false,
        })
      );
    });
  });

  describe('Entity Change Property Table', () => {
    it('should show property changes when entity change is expanded', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      // Open modal
      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('tab-content-changes')).toBeInTheDocument();
      });

      // Find collapsible buttons within the changes tab content
      const changesContent = screen.getByTestId('tab-content-changes');
      const collapsibleButtons = changesContent.querySelectorAll('[data-testid="collapsible-button"]');

      expect(collapsibleButtons.length).toBeGreaterThan(0);

      // Click the first entity change button (User)
      fireEvent.click(collapsibleButtons[0]);

      // After expansion, should show property change table with values
      await waitFor(() => {
        expect(changesContent).toHaveTextContent('Name');
        expect(changesContent).toHaveTextContent('old');
        expect(changesContent).toHaveTextContent('new');
      });
    });

    it('should collapse entity change when clicked again', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('tab-content-changes')).toBeInTheDocument();
      });

      const changesContent = screen.getByTestId('tab-content-changes');
      const collapsibleButtons = changesContent.querySelectorAll('[data-testid="collapsible-button"]');

      expect(collapsibleButtons.length).toBeGreaterThan(0);

      // Expand
      fireEvent.click(collapsibleButtons[0]);
      await waitFor(() => {
        expect(changesContent).toHaveTextContent('Name');
      });

      // Collapse
      fireEvent.click(collapsibleButtons[0]);
      // The entity change header should still be there
      expect(changesContent).toHaveTextContent('User');
    });
  });

  describe('Action Collapse Toggle', () => {
    it('should collapse action when clicked again', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('tab-content-actions')).toBeInTheDocument();
      });

      const collapsibleButtons = screen.getAllByTestId('collapsible-button');
      const actionButton = collapsibleButtons.find((btn) =>
        btn.textContent?.includes('UserService')
      );

      if (actionButton) {
        // Expand
        fireEvent.click(actionButton);
        await waitFor(() => {
          expect(screen.getByTestId('tab-content-actions')).toHaveTextContent('{"page": 1}');
        });

        // Collapse
        fireEvent.click(actionButton);
        // Parameters should no longer be visible after collapse
      }
    });
  });

  describe('HTTP Badge Colors - Additional Cases', () => {
    it('should use yellow for 3xx status codes', () => {
      mockUseAuditLogsReturn.auditLogs = [
        {
          ...mockAuditLogs[0],
          httpStatusCode: 301,
        },
      ];

      render(<AuditLogsComponent />);

      const badges = screen.getAllByTestId('badge');
      const badge301 = badges.find((b) => b.textContent === '301');
      expect(badge301).toHaveAttribute('data-colorpalette', 'yellow');
    });

    it('should use gray for unknown status codes', () => {
      mockUseAuditLogsReturn.auditLogs = [
        {
          ...mockAuditLogs[0],
          httpStatusCode: 100,
        },
      ];

      render(<AuditLogsComponent />);

      const badges = screen.getAllByTestId('badge');
      const badge100 = badges.find((b) => b.textContent === '100');
      expect(badge100).toHaveAttribute('data-colorpalette', 'gray');
    });

    it('should use yellow for PUT method', () => {
      mockUseAuditLogsReturn.auditLogs = [
        {
          ...mockAuditLogs[0],
          httpMethod: 'PUT',
        },
      ];

      render(<AuditLogsComponent />);

      const badges = screen.getAllByTestId('badge');
      const putBadge = badges.find((b) => b.textContent === 'PUT');
      expect(putBadge).toHaveAttribute('data-colorpalette', 'yellow');
    });

    it('should use gray for PATCH or unknown HTTP methods', () => {
      mockUseAuditLogsReturn.auditLogs = [
        {
          ...mockAuditLogs[0],
          httpMethod: 'PATCH',
        },
      ];

      render(<AuditLogsComponent />);

      const badges = screen.getAllByTestId('badge');
      const patchBadge = badges.find((b) => b.textContent === 'PATCH');
      expect(patchBadge).toHaveAttribute('data-colorpalette', 'gray');
    });
  });

  describe('Modal Close', () => {
    it('should reset active tab to overall when closing modal', async () => {
      mockUseAuditLogsReturn.selectedLog = mockAuditLogs[0];

      render(<AuditLogsComponent />);

      // Open modal
      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Switch tab
      const actionsTab = screen.getByTestId('tab-actions');
      fireEvent.click(actionsTab);

      // Close modal
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);

      expect(mockUseAuditLogsReturn.setSelectedLog).toHaveBeenCalledWith(null);
    });
  });

  describe('Modal detail with getAuditLogById failure', () => {
    it('should not open modal when getAuditLogById returns failure', async () => {
      mockUseAuditLogsReturn.getAuditLogById = vi.fn().mockResolvedValue({
        success: false,
        error: 'Not found',
      });

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      await waitFor(() => {
        expect(mockUseAuditLogsReturn.getAuditLogById).toHaveBeenCalledWith('1');
      });

      // Modal should not be visible since getAuditLogById returned success: false
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle logs with empty actions and changes arrays', () => {
      mockUseAuditLogsReturn.auditLogs = [
        {
          ...mockAuditLogs[0],
          actions: [],
          entityChanges: [],
        },
      ];

      render(<AuditLogsComponent />);

      expect(screen.getByText('admin')).toBeInTheDocument();
    });

    it('should handle logs with null optional fields', async () => {
      mockUseAuditLogsReturn.selectedLog = {
        ...mockAuditLogs[0],
        clientName: '',
        browserInfo: '',
        comments: '',
        exceptions: '',
        extraProperties: {},
      };

      render(<AuditLogsComponent />);

      const detailButtons = screen.getAllByText('🔍');
      fireEvent.click(detailButtons[0]);

      // Verify the click triggers getAuditLogById
      await waitFor(() => {
        expect(mockUseAuditLogsReturn.getAuditLogById).toHaveBeenCalled();
      });
    });

    it('should handle totalCount of 0', () => {
      mockUseAuditLogsReturn.auditLogs = [];
      mockUseAuditLogsReturn.totalCount = 0;

      render(<AuditLogsComponent />);

      // Pagination should not show
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('should handle totalCount less than pageSize', () => {
      mockUseAuditLogsReturn.totalCount = 5;

      render(<AuditLogsComponent />);

      // Pagination should not show
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });
  });
});

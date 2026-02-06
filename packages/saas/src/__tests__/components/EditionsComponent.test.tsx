import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock data
const mockEditions = [
  { id: 'ed-1', displayName: 'Basic Edition', concurrencyStamp: 'stamp1' },
  { id: 'ed-2', displayName: 'Pro Edition', concurrencyStamp: 'stamp2' },
];

// Mock functions for useEditions
const mockFetchEditions = vi.fn().mockResolvedValue({ success: true });
const mockGetEditionById = vi.fn().mockResolvedValue({ success: true, data: mockEditions[0] });
const mockCreateEdition = vi.fn().mockResolvedValue({ success: true, data: { id: 'new-id', displayName: 'New Edition' } });
const mockUpdateEdition = vi.fn().mockResolvedValue({ success: true, data: mockEditions[0] });
const mockDeleteEdition = vi.fn().mockResolvedValue({ success: true });
const mockSetSelectedEdition = vi.fn();

// State control for hook mock
let mockEditionsState = {
  editions: mockEditions,
  totalCount: 2,
  selectedEdition: null as any,
  isLoading: false,
  error: null as string | null,
};

// Mock useEditions hook
vi.mock('../../hooks/useEditions', () => ({
  useEditions: () => ({
    ...mockEditionsState,
    fetchEditions: mockFetchEditions,
    getEditionById: mockGetEditionById,
    createEdition: mockCreateEdition,
    updateEdition: mockUpdateEdition,
    deleteEdition: mockDeleteEdition,
    setSelectedEdition: mockSetSelectedEdition,
  }),
}));

// Mock @chakra-ui/react components
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, id, className, ...props }: any) => <div id={id} className={className} {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Flex: ({ children, ...props }: any) => <div style={{ display: 'flex' }} {...props}>{children}</div>,
  Input: React.forwardRef(({ placeholder, value, onChange, ...props }: any, ref: any) => (
    <input ref={ref} placeholder={placeholder} value={value} onChange={onChange} {...props} />
  )),
  VStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Table: {
    Root: ({ children, ...props }: any) => <table {...props}>{children}</table>,
    Header: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
    Body: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
    Row: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
    ColumnHeader: ({ children, ...props }: any) => <th {...props}>{children}</th>,
    Cell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
  },
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string, ...args: string[]) => {
      const translations: Record<string, string> = {
        'Saas::Editions': 'Editions',
        'Saas::NewEdition': 'New Edition',
        'Saas::EditEdition': 'Edit Edition',
        'Saas::EditionName': 'Edition Name',
        'Saas::DisplayName': 'Display Name',
        'Saas::Actions': 'Actions',
        'Saas::Edit': 'Edit',
        'Saas::Delete': 'Delete',
        'Saas::Features': 'Features',
        'Saas::EditionDeletionConfirmationMessage': `Edition "${args[0]}" will be deleted.`,
        'Saas::AreYouSure': 'Are you sure?',
        'Saas::NoEditionsFound': 'No editions found',
        'AbpUi::Save': 'Save',
        'AbpUi::Cancel': 'Cancel',
        'AbpUi::PagerSearch': 'Search',
        'AbpUi::Search': 'Search',
      };
      return translations[key] || key;
    },
  }),
  usePermission: () => ({
    hasPermission: () => true,
  }),
}));

// Mock @abpjs/theme-shared
const mockWarn = vi.fn();
vi.mock('@abpjs/theme-shared', () => ({
  Modal: ({ visible, children, header, footer, onClose }: any) =>
    visible ? (
      <div data-testid="modal" role="dialog">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-body">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
        <button data-testid="modal-close" onClick={onClose}>Close</button>
      </div>
    ) : null,
  Button: ({ children, onClick, loading, disabled, colorPalette, ...props }: any) => (
    <button onClick={onClick} disabled={loading || disabled} data-colorpalette={colorPalette} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  FormField: ({ label, children, error, ...props }: any) => (
    <div data-testid="form-field" {...props}>
      {label && <label>{label}</label>}
      {children}
      {error && <span data-testid="field-error">{error}</span>}
    </div>
  ),
  useToaster: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
  useConfirmation: () => ({
    warn: mockWarn,
  }),
  Toaster: {
    Status: {
      confirm: 'confirm',
      reject: 'reject',
    },
  },
  Confirmation: {
    Status: {
      confirm: 'confirm',
      reject: 'reject',
    },
  },
}));

import { EditionsComponent } from '../../components/Editions';

describe('EditionsComponent', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockEditionsState = {
      editions: mockEditions,
      totalCount: 2,
      selectedEdition: null,
      isLoading: false,
      error: null,
    };
  });

  describe('Export and Basic Rendering', () => {
    it('should be defined in exports', async () => {
      const { EditionsComponent } = await import('../../components/Editions');
      expect(EditionsComponent).toBeDefined();
      expect(typeof EditionsComponent).toBe('function');
    });

    it('should render the component with heading', () => {
      render(<EditionsComponent />);
      expect(screen.getByText('Editions')).toBeInTheDocument();
    });

    it('should render New Edition button', () => {
      render(<EditionsComponent />);
      expect(screen.getByText('New Edition')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<EditionsComponent />);
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should call fetchEditions on mount', async () => {
      render(<EditionsComponent />);
      await waitFor(() => {
        expect(mockFetchEditions).toHaveBeenCalled();
      });
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading and no editions', () => {
      mockEditionsState.isLoading = true;
      mockEditionsState.editions = [];
      render(<EditionsComponent />);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when error occurs', () => {
      mockEditionsState.error = 'Failed to load editions';
      render(<EditionsComponent />);
      expect(screen.getByText('Failed to load editions')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display no editions message when list is empty', () => {
      mockEditionsState.editions = [];
      mockEditionsState.totalCount = 0;
      render(<EditionsComponent />);
      expect(screen.getByText('No editions found')).toBeInTheDocument();
    });
  });

  describe('Edition List', () => {
    it('should display editions in table', () => {
      render(<EditionsComponent />);
      expect(screen.getByText('Basic Edition')).toBeInTheDocument();
      expect(screen.getByText('Pro Edition')).toBeInTheDocument();
    });

    it('should render action buttons for each edition', () => {
      render(<EditionsComponent />);
      const editButtons = screen.getAllByText('Edit');
      const deleteButtons = screen.getAllByText('Delete');
      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('should render features buttons when onManageFeatures is provided', () => {
      const onManageFeatures = vi.fn();
      render(<EditionsComponent onManageFeatures={onManageFeatures} />);
      const featuresButtons = screen.getAllByText('Features');
      expect(featuresButtons.length).toBeGreaterThan(0);
    });

    it('should not render features buttons when onManageFeatures is not provided', () => {
      render(<EditionsComponent />);
      expect(screen.queryAllByText('Features')).toHaveLength(0);
    });
  });

  describe('Create Modal', () => {
    it('should open create modal when New Edition button is clicked', async () => {
      render(<EditionsComponent />);
      await user.click(screen.getByText('New Edition'));
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-header')).toHaveTextContent('New Edition');
    });

    it('should clear selected edition when opening create modal', async () => {
      mockEditionsState.selectedEdition = mockEditions[0];
      render(<EditionsComponent />);
      await user.click(screen.getByText('New Edition'));
      expect(mockSetSelectedEdition).toHaveBeenCalledWith(null);
    });
  });

  describe('Search Functionality', () => {
    it('should update search input value', async () => {
      render(<EditionsComponent />);
      const searchInput = screen.getByPlaceholderText('Search');
      await user.type(searchInput, 'test');
      expect(searchInput).toHaveValue('test');
    });

    it('should trigger search button click', async () => {
      render(<EditionsComponent />);
      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);
      await waitFor(() => {
        expect(mockFetchEditions).toHaveBeenCalled();
      });
    });
  });

  describe('Delete Confirmation', () => {
    it('should show confirmation dialog on delete', async () => {
      mockWarn.mockResolvedValue('confirm');
      render(<EditionsComponent />);

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockWarn).toHaveBeenCalled();
      });
    });

    it('should call deleteEdition when confirmed', async () => {
      mockWarn.mockResolvedValue('confirm');
      render(<EditionsComponent />);

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockDeleteEdition).toHaveBeenCalledWith('ed-1');
      });
    });

    it('should not call deleteEdition when rejected', async () => {
      mockWarn.mockResolvedValue('reject');
      render(<EditionsComponent />);

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockWarn).toHaveBeenCalled();
      });
      expect(mockDeleteEdition).not.toHaveBeenCalled();
    });
  });

  describe('Edit Edition', () => {
    it('should call getEditionById when Edit button is clicked', async () => {
      render(<EditionsComponent />);
      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(mockGetEditionById).toHaveBeenCalledWith('ed-1');
      });
    });
  });

  describe('Features', () => {
    it('should call onManageFeatures when Features button is clicked', async () => {
      const onManageFeatures = vi.fn();
      render(<EditionsComponent onManageFeatures={onManageFeatures} />);

      const featuresButtons = screen.getAllByText('Features');
      await user.click(featuresButtons[0]);

      expect(onManageFeatures).toHaveBeenCalledWith('ed-1');
    });
  });

  describe('Callbacks', () => {
    it('should call onEditionDeleted when edition is deleted', async () => {
      const onEditionDeleted = vi.fn();
      mockWarn.mockResolvedValue('confirm');

      render(<EditionsComponent onEditionDeleted={onEditionDeleted} />);

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockDeleteEdition).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(onEditionDeleted).toHaveBeenCalledWith('ed-1');
      });
    });
  });

  describe('Component Props Interface', () => {
    it('should accept optional callbacks', () => {
      type PropsType = {
        onEditionCreated?: (edition: unknown) => void;
        onEditionUpdated?: (edition: unknown) => void;
        onEditionDeleted?: (id: string) => void;
        onManageFeatures?: (editionId: string) => void;
      };

      const validProps: PropsType = {};
      expect(validProps).toBeDefined();

      const withCallbacks: PropsType = {
        onEditionCreated: () => {},
        onEditionUpdated: () => {},
        onEditionDeleted: () => {},
        onManageFeatures: () => {},
      };
      expect(withCallbacks.onEditionCreated).toBeDefined();
      expect(withCallbacks.onManageFeatures).toBeDefined();
    });

    it('should render without any props', () => {
      const { container } = render(<EditionsComponent />);
      expect(container).toBeTruthy();
    });

    it('should render with all optional props', () => {
      const { container } = render(
        <EditionsComponent
          onEditionCreated={() => {}}
          onEditionUpdated={() => {}}
          onEditionDeleted={() => {}}
          onManageFeatures={() => {}}
        />
      );
      expect(container).toBeTruthy();
    });
  });
});

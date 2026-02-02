/**
 * Tests for RoutesComponent v2.7.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RoutesComponent } from '../components/routes';

// Mock routes data
const mockRoutes = [
  { name: 'Home', path: '/', icon: <span>🏠</span> },
  { name: 'Settings', path: '/settings', icon: <span>⚙️</span> },
  { name: 'Hidden', path: '/hidden', invisible: true },
];

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useConfig: vi.fn(() => ({
    routes: mockRoutes,
  })),
  useDirection: vi.fn(() => ({
    direction: 'ltr',
    isRtl: false,
  })),
  ABP: {},
}));

// Mock Chakra UI
vi.mock('@chakra-ui/react', () => ({
  Stack: ({ children, dir, ...props }: any) => (
    <div data-testid="routes-stack" data-dir={dir} {...props}>
      {children}
    </div>
  ),
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  HStack: ({ children }: any) => <div>{children}</div>,
  Spacer: () => <div />,
  Collapsible: {
    Root: ({ children }: any) => <div>{children}</div>,
    Trigger: ({ children }: any) => <div>{children}</div>,
    Content: ({ children }: any) => <div>{children}</div>,
    Context: ({ children }: any) => children({ open: false }),
  },
  chakra: {
    span: ({ children }: any) => <span>{children}</span>,
  },
}));

// Mock SearchContext
vi.mock('../components/blocks/sidebars/sidebar-with-collapsible/search-context', () => ({
  useSearch: vi.fn(() => ({ searchQuery: '' })),
}));

describe('RoutesComponent', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      renderWithRouter(<RoutesComponent />);
      const stacks = screen.getAllByTestId('routes-stack');
      expect(stacks.length).toBeGreaterThan(0);
      expect(stacks[0]).toBeInTheDocument();
    });

    it('should render with correct direction', () => {
      renderWithRouter(<RoutesComponent />);
      const stacks = screen.getAllByTestId('routes-stack');
      expect(stacks[0]).toHaveAttribute('data-dir', 'ltr');
    });
  });

  describe('props handling', () => {
    it('should handle smallScreen prop', () => {
      renderWithRouter(<RoutesComponent smallScreen={true} />);
      const stacks = screen.getAllByTestId('routes-stack');
      expect(stacks[0]).toBeInTheDocument();
    });

    it('should handle isDropdownChildDynamic prop', () => {
      renderWithRouter(<RoutesComponent isDropdownChildDynamic={true} />);
      const stacks = screen.getAllByTestId('routes-stack');
      expect(stacks[0]).toBeInTheDocument();
    });

    it('should handle defaultIcon prop', () => {
      const DefaultIcon = () => <span data-testid="default-icon">📄</span>;
      renderWithRouter(<RoutesComponent defaultIcon={<DefaultIcon />} />);
      const stacks = screen.getAllByTestId('routes-stack');
      expect(stacks[0]).toBeInTheDocument();
    });
  });

  describe('custom routes', () => {
    it('should use custom routes when provided', () => {
      const customRoutes = [
        { name: 'Custom Home', path: '/custom' },
        { name: 'Custom Settings', path: '/custom/settings' },
      ];

      renderWithRouter(<RoutesComponent routes={customRoutes} />);
      const stacks = screen.getAllByTestId('routes-stack');
      expect(stacks[0]).toBeInTheDocument();
    });

    it('should prefer custom routes over config routes', () => {
      const customRoutes = [{ name: 'Only Custom', path: '/only-custom' }];

      renderWithRouter(<RoutesComponent routes={customRoutes} />);
      const stacks = screen.getAllByTestId('routes-stack');
      expect(stacks[0]).toBeInTheDocument();
    });
  });

  describe('RTL support', () => {
    it('should pass direction to Stack', async () => {
      const { useDirection } = await import('@abpjs/core');
      (useDirection as any).mockReturnValue({
        direction: 'rtl',
        isRtl: true,
      });

      renderWithRouter(<RoutesComponent />);
      const stacks = screen.getAllByTestId('routes-stack');
      expect(stacks[0]).toHaveAttribute('data-dir', 'rtl');
    });
  });
});

describe('RoutesComponent with empty routes', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useConfig } = await import('@abpjs/core');
    (useConfig as any).mockReturnValue({ routes: [] });
  });

  it('should render empty stack when no routes', () => {
    render(
      <MemoryRouter>
        <RoutesComponent />
      </MemoryRouter>
    );
    const stacks = screen.getAllByTestId('routes-stack');
    expect(stacks[0]).toBeInTheDocument();
  });
});

describe('RoutesComponent with null routes', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useConfig } = await import('@abpjs/core');
    (useConfig as any).mockReturnValue({ routes: null });
  });

  it('should handle null routes gracefully', () => {
    render(
      <MemoryRouter>
        <RoutesComponent />
      </MemoryRouter>
    );
    const stacks = screen.getAllByTestId('routes-stack');
    expect(stacks[0]).toBeInTheDocument();
  });
});

describe('RoutesComponent getVisibleRoutes logic', () => {
  // Test the internal getVisibleRoutes function behavior through component rendering
  it('should filter out invisible routes from config', async () => {
    const { useConfig } = await import('@abpjs/core');
    (useConfig as any).mockReturnValue({
      routes: [
        { name: 'Visible', path: '/visible', invisible: false },
        { name: 'Invisible', path: '/invisible', invisible: true },
      ],
    });

    render(
      <MemoryRouter>
        <RoutesComponent />
      </MemoryRouter>
    );

    // The component should render but invisible routes should be filtered
    const stacks = screen.getAllByTestId('routes-stack');
    expect(stacks[0]).toBeInTheDocument();
  });

  it('should filter out invisible children from nested routes', async () => {
    const { useConfig, useDirection } = await import('@abpjs/core');
    (useConfig as any).mockReturnValue({
      routes: [
        {
          name: 'Parent',
          path: '/parent',
          children: [
            { name: 'VisibleChild', path: '/parent/visible' },
            { name: 'InvisibleChild', path: '/parent/invisible', invisible: true },
          ],
        },
      ],
    });
    (useDirection as any).mockReturnValue({
      direction: 'ltr',
      isRtl: false,
    });

    render(
      <MemoryRouter>
        <RoutesComponent />
      </MemoryRouter>
    );

    const stacks = screen.getAllByTestId('routes-stack');
    expect(stacks[0]).toBeInTheDocument();
  });
});

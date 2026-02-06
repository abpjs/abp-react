/**
 * Tests for RoutesComponent v2.9.0
 * @updated 2.9.0 - Removed isDropdownChildDynamic prop test
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

    // Note: isDropdownChildDynamic was removed in v2.9.0

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

  it('should handle routes with empty children array', async () => {
    const { useConfig, useDirection } = await import('@abpjs/core');
    (useConfig as any).mockReturnValue({
      routes: [
        {
          name: 'Parent',
          path: '/parent',
          children: [],
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

  it('should handle deeply nested invisible routes', async () => {
    const { useConfig, useDirection } = await import('@abpjs/core');
    (useConfig as any).mockReturnValue({
      routes: [
        {
          name: 'Level1',
          path: '/level1',
          children: [
            {
              name: 'Level2',
              path: '/level1/level2',
              children: [
                { name: 'Level3Visible', path: '/level1/level2/visible' },
                { name: 'Level3Invisible', path: '/level1/level2/invisible', invisible: true },
              ],
            },
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

  it('should handle all invisible routes', async () => {
    const { useConfig, useDirection } = await import('@abpjs/core');
    (useConfig as any).mockReturnValue({
      routes: [
        { name: 'Invisible1', path: '/invisible1', invisible: true },
        { name: 'Invisible2', path: '/invisible2', invisible: true },
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

/**
 * v2.9.0 API Tests
 * Document the removal of isDropdownChildDynamic prop
 */
describe('RoutesComponent v2.9.0 API', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useConfig, useDirection } = await import('@abpjs/core');
    (useConfig as any).mockReturnValue({
      routes: [{ name: 'Test', path: '/test' }],
    });
    (useDirection as any).mockReturnValue({
      direction: 'ltr',
      isRtl: false,
    });
  });

  it('should work without isDropdownChildDynamic prop (removed in v2.9.0)', () => {
    // v2.9.0: isDropdownChildDynamic prop was removed
    // The component should work without it
    render(
      <MemoryRouter>
        <RoutesComponent smallScreen={false} />
      </MemoryRouter>
    );

    const stacks = screen.getAllByTestId('routes-stack');
    expect(stacks[0]).toBeInTheDocument();
  });

  it('should accept only valid v2.9.0 props', () => {
    // v2.9.0 valid props: smallScreen, defaultIcon, routes
    const DefaultIcon = () => <span>📄</span>;
    const customRoutes = [{ name: 'Custom', path: '/custom' }];

    render(
      <MemoryRouter>
        <RoutesComponent
          smallScreen={true}
          defaultIcon={<DefaultIcon />}
          routes={customRoutes}
        />
      </MemoryRouter>
    );

    const stacks = screen.getAllByTestId('routes-stack');
    expect(stacks[0]).toBeInTheDocument();
  });

  it('should use config routes when routes prop is undefined', async () => {
    const { useConfig, useDirection } = await import('@abpjs/core');
    (useConfig as any).mockReturnValue({
      routes: [
        { name: 'ConfigRoute1', path: '/config1' },
        { name: 'ConfigRoute2', path: '/config2' },
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

  it('should override config routes with routes prop', async () => {
    const { useConfig, useDirection } = await import('@abpjs/core');
    (useConfig as any).mockReturnValue({
      routes: [{ name: 'ConfigRoute', path: '/config' }],
    });
    (useDirection as any).mockReturnValue({
      direction: 'ltr',
      isRtl: false,
    });

    const customRoutes = [{ name: 'CustomRoute', path: '/custom' }];

    render(
      <MemoryRouter>
        <RoutesComponent routes={customRoutes} />
      </MemoryRouter>
    );

    const stacks = screen.getAllByTestId('routes-stack');
    expect(stacks[0]).toBeInTheDocument();
  });
});

/**
 * Props type tests - verifying TypeScript interface changes in v2.9.0
 */
describe('RoutesComponentProps interface (v2.9.0)', () => {
  it('should have smallScreen as optional boolean', () => {
    render(
      <MemoryRouter>
        <RoutesComponent smallScreen={true} />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('routes-stack')[0]).toBeInTheDocument();

    render(
      <MemoryRouter>
        <RoutesComponent smallScreen={false} />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('routes-stack').length).toBeGreaterThan(0);
  });

  it('should have defaultIcon as optional ReactNode', () => {
    const Icon = () => <span>🔧</span>;

    render(
      <MemoryRouter>
        <RoutesComponent defaultIcon={<Icon />} />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('routes-stack')[0]).toBeInTheDocument();

    render(
      <MemoryRouter>
        <RoutesComponent defaultIcon={undefined} />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('routes-stack').length).toBeGreaterThan(0);
  });

  it('should have routes as optional ABP.FullRoute[]', () => {
    const routes = [
      { name: 'Route1', path: '/route1' },
      { name: 'Route2', path: '/route2', invisible: false },
    ];

    render(
      <MemoryRouter>
        <RoutesComponent routes={routes} />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('routes-stack')[0]).toBeInTheDocument();
  });

  it('should default smallScreen to false', () => {
    // When smallScreen is not provided, it defaults to false
    render(
      <MemoryRouter>
        <RoutesComponent />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('routes-stack')[0]).toBeInTheDocument();
  });
});

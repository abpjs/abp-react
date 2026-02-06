import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

// Mock @abpjs/core
vi.mock('@abpjs/core', async () => {
  const actual = await vi.importActual('@abpjs/core');
  return {
    ...actual,
    useLocalization: () => ({
      t: (key: string) => key,
    }),
    useRestService: () => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }),
    useConfig: () => ({
      environment: {
        oAuthConfig: {
          authority: 'https://example.com',
          client_id: 'test-client',
          scope: 'openid profile',
        },
      },
    }),
    useAbp: () => ({
      store: { dispatch: vi.fn() },
      axiosInstance: { post: vi.fn() },
      applicationConfigurationService: { getConfiguration: vi.fn() },
      userManager: null,
    }),
    useUserManager: () => null,
    configActions: {
      setApplicationConfiguration: vi.fn(),
    },
    sessionActions: {
      setTenant: vi.fn(),
    },
    selectTenant: () => ({ id: '', name: '' }),
  };
});

// Mock react-redux
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => vi.fn(),
    useSelector: (selector: any) => selector(),
  };
});

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  Alert: ({ children, status }: any) => <div data-status={status}>{children}</div>,
  Button: ({ children, loading, ...props }: any) => (
    <button {...props} disabled={loading}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  Checkbox: ({ children, ...props }: any) => (
    <label>
      <input type="checkbox" {...props} />
      {children}
    </label>
  ),
  Modal: ({ children, visible }: any) => (visible ? <div role="dialog">{children}</div> : null),
  useToaster: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

// Mock @chakra-ui/react components
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  HStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  VStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Input: (props: any) => <input {...props} />,
  InputGroup: ({ children, startElement }: any) => <div>{startElement}{children}</div>,
  Link: ({ children, asChild, ...props }: any) => asChild ? children : <a {...props}>{children}</a>,
  Show: ({ when, children }: any) => (when ? children : null),
  Stack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Text: ({ children, as: Component = 'span', ...props }: any) => {
    const Tag = Component as keyof JSX.IntrinsicElements;
    return <Tag {...props}>{children}</Tag>;
  },
  Card: {
    Root: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Body: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  Field: {
    Root: ({ children, invalid }: any) => <div data-invalid={invalid}>{children}</div>,
    Label: ({ children }: any) => <label>{children}</label>,
    ErrorText: ({ children }: any) => <span role="alert">{children}</span>,
  },
  Tabs: {
    Root: ({ children, value, onValueChange: _onValueChange }: any) => <div data-value={value}>{children}</div>,
    List: ({ children }: any) => <div role="tablist">{children}</div>,
    Trigger: ({ children, value }: any) => <button role="tab" data-value={value}>{children}</button>,
    Content: ({ children, value }: any) => <div role="tabpanel" data-value={value}>{children}</div>,
  },
}));

// Mock react-icons/lu
vi.mock('react-icons/lu', () => ({
  LuLock: () => <span data-testid="lock-icon" />,
  LuMail: () => <span data-testid="mail-icon" />,
  LuUser: () => <span data-testid="user-icon" />,
  LuPhone: () => <span data-testid="phone-icon" />,
}));

/**
 * Test Setup for @abpjs/chat
 * v2.9.0
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-router-dom
export const mockNavigate = vi.fn();
export const mockLocation = { pathname: '/chat' };

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useRest: () => ({
    request: vi.fn(),
  }),
  useConfig: () => ({
    getApiUrl: () => 'http://localhost:44300',
  }),
  useAuth: () => ({
    getAccessToken: () => 'mock-token',
    isAuthenticated: true,
    currentUser: {
      id: 'test-user-id',
      userName: 'testuser',
    },
  }),
}));

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  useToaster: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

// Mock @microsoft/signalr
vi.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: vi.fn().mockReturnValue({
    withUrl: vi.fn().mockReturnThis(),
    withAutomaticReconnect: vi.fn().mockReturnThis(),
    build: vi.fn().mockReturnValue({
      start: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn().mockResolvedValue(undefined),
      on: vi.fn(),
      off: vi.fn(),
      state: 'Connected',
    }),
  }),
  HubConnectionState: {
    Disconnected: 'Disconnected',
    Connecting: 'Connecting',
    Connected: 'Connected',
    Disconnecting: 'Disconnecting',
    Reconnecting: 'Reconnecting',
  },
}));

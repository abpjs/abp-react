/**
 * Test Setup for @abpjs/setting-management
 * v0.9.0
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-router-dom
export const mockNavigate = vi.fn();
export const mockLocation = { pathname: '/settings' };

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Mock @abpjs/theme-shared for SettingTab type
vi.mock('@abpjs/theme-shared', () => ({
  // Re-export type as empty object (types don't need mocking)
}));

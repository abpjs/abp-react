/**
 * Test Setup for @abpjs/file-management
 * v3.2.0
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-router-dom
export const mockNavigate = vi.fn();
export const mockLocation = { pathname: '/file-management' };

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  // Re-export type as empty object (types don't need mocking)
}));

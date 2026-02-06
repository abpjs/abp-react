/**
 * Test Setup for @abpjs/text-template-management
 * v2.7.0
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-router-dom
export const mockNavigate = vi.fn();
export const mockLocation = { pathname: '/text-templates' };

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  useParams: () => ({}),
}));

// Mock @abpjs/core
export const mockRestService = {
  request: vi.fn(),
};

vi.mock('@abpjs/core', () => ({
  useRestService: () => mockRestService,
}));

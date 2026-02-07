import { vi } from 'vitest';

// Mock requestAnimationFrame for any potential async tests
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 0));
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

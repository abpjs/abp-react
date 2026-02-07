import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver which is not available in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Suppress CSS parsing errors from Chakra UI Emotion styles in jsdom
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Could not parse CSS stylesheet') ||
      args[0].includes('Error: Unrecognized feature'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Mock scrollTo (used by Chakra portals)
Element.prototype.scrollTo = vi.fn() as unknown as Element['scrollTo'];

// Mock requestAnimationFrame (used by Chakra animations)
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 0)) as unknown as typeof requestAnimationFrame;
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id)) as unknown as typeof cancelAnimationFrame;

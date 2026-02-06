import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import {
  ThemeSharedAppendContentContext,
  THEME_SHARED_APPEND_CONTENT,
} from '../constants/append-content';

describe('append-content constants (v2.4.0)', () => {
  describe('THEME_SHARED_APPEND_CONTENT', () => {
    it('should have correct token name', () => {
      expect(THEME_SHARED_APPEND_CONTENT).toBe('THEME_SHARED_APPEND_CONTENT');
    });

    it('should be a string constant', () => {
      expect(typeof THEME_SHARED_APPEND_CONTENT).toBe('string');
    });
  });

  describe('ThemeSharedAppendContentContext', () => {
    it('should be a React context', () => {
      expect(ThemeSharedAppendContentContext).toBeDefined();
      expect(ThemeSharedAppendContentContext.Provider).toBeDefined();
      expect(ThemeSharedAppendContentContext.Consumer).toBeDefined();
    });

    it('should have undefined as default value', () => {
      const TestComponent = () => {
        const value = useContext(ThemeSharedAppendContentContext);
        return <div data-testid="value">{value === undefined ? 'undefined' : 'defined'}</div>;
      };

      render(<TestComponent />);
      expect(screen.getByTestId('value').textContent).toBe('undefined');
    });

    it('should accept a function as context value', async () => {
      const mockAppendContent = vi.fn().mockResolvedValue(undefined);

      const TestComponent = () => {
        const appendContent = useContext(ThemeSharedAppendContentContext);
        return (
          <div>
            <span data-testid="captured">{appendContent ? 'has-function' : 'no-function'}</span>
            <button data-testid="call" onClick={() => appendContent?.()} />
          </div>
        );
      };

      render(
        <ThemeSharedAppendContentContext.Provider value={mockAppendContent}>
          <TestComponent />
        </ThemeSharedAppendContentContext.Provider>
      );

      expect(screen.getByTestId('captured').textContent).toBe('has-function');
      await act(async () => {
        screen.getByTestId('call').click();
      });
      expect(mockAppendContent).toHaveBeenCalledTimes(1);
    });

    it('should allow calling the provided append content function', async () => {
      const mockAppendContent = vi.fn().mockResolvedValue(undefined);

      const TestComponent = () => {
        const appendContent = useContext(ThemeSharedAppendContentContext);
        return (
          <button
            data-testid="trigger"
            onClick={() => appendContent?.()}
          >
            Append
          </button>
        );
      };

      render(
        <ThemeSharedAppendContentContext.Provider value={mockAppendContent}>
          <TestComponent />
        </ThemeSharedAppendContentContext.Provider>
      );

      const button = screen.getByTestId('trigger');
      await act(async () => {
        button.click();
      });

      expect(mockAppendContent).toHaveBeenCalledTimes(1);
    });

    it('should handle async append content function', async () => {
      let appendCompleted = false;
      const mockAppendContent = vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        appendCompleted = true;
      });

      const TestComponent = () => {
        const appendContent = useContext(ThemeSharedAppendContentContext);
        return (
          <button
            data-testid="async-trigger"
            onClick={async () => {
              await appendContent?.();
            }}
          >
            Append Async
          </button>
        );
      };

      render(
        <ThemeSharedAppendContentContext.Provider value={mockAppendContent}>
          <TestComponent />
        </ThemeSharedAppendContentContext.Provider>
      );

      const button = screen.getByTestId('async-trigger');
      await act(async () => {
        button.click();
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(mockAppendContent).toHaveBeenCalledTimes(1);
      expect(appendCompleted).toBe(true);
    });

    it('should allow undefined value to be provided explicitly', () => {
      const TestComponent = () => {
        const value = useContext(ThemeSharedAppendContentContext);
        return <div data-testid="explicit-undefined">{value === undefined ? 'is-undefined' : 'not-undefined'}</div>;
      };

      render(
        <ThemeSharedAppendContentContext.Provider value={undefined}>
          <TestComponent />
        </ThemeSharedAppendContentContext.Provider>
      );

      expect(screen.getByTestId('explicit-undefined').textContent).toBe('is-undefined');
    });

    it('should support nested providers with override', async () => {
      const outerFn = vi.fn().mockResolvedValue(undefined);
      const innerFn = vi.fn().mockResolvedValue(undefined);

      const TestComponent = () => {
        const appendContent = useContext(ThemeSharedAppendContentContext);
        return (
          <div>
            <span data-testid="nested">{appendContent ? 'has-function' : 'no-function'}</span>
            <button data-testid="call-nested" onClick={() => appendContent?.()} />
          </div>
        );
      };

      render(
        <ThemeSharedAppendContentContext.Provider value={outerFn}>
          <ThemeSharedAppendContentContext.Provider value={innerFn}>
            <TestComponent />
          </ThemeSharedAppendContentContext.Provider>
        </ThemeSharedAppendContentContext.Provider>
      );

      expect(screen.getByTestId('nested').textContent).toBe('has-function');
      await act(async () => {
        screen.getByTestId('call-nested').click();
      });
      expect(innerFn).toHaveBeenCalledTimes(1);
      expect(outerFn).not.toHaveBeenCalled();
    });
  });
});

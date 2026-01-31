import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LoaderBar } from '../components/loader-bar/LoaderBar';

// Mock @abpjs/core useLoader hook
const mockUseLoader = vi.fn();
vi.mock('@abpjs/core', () => ({
  useLoader: () => mockUseLoader(),
}));

describe('LoaderBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUseLoader.mockReturnValue({ loading: false, loadingCount: 0, requests: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should not render when not loading', () => {
    mockUseLoader.mockReturnValue({ loading: false });

    const { container } = render(<LoaderBar />);

    // The component has an initial useEffect that calls stopLoading when loading is false
    // This sets progressLevel to 100 briefly, then hides after stopDelay
    // After stopDelay, container should be null
    act(() => {
      vi.advanceTimersByTime(400); // default stopDelay
    });

    expect(container.firstChild).toBeNull();
  });

  it('should render when loading', () => {
    mockUseLoader.mockReturnValue({ loading: true });

    render(<LoaderBar />);

    const loaderBar = document.querySelector('.abp-loader-bar');
    expect(loaderBar).toBeInTheDocument();
  });

  it('should use custom containerClass', () => {
    mockUseLoader.mockReturnValue({ loading: true });

    render(<LoaderBar containerClass="custom-container" />);

    const loaderBar = document.querySelector('.custom-container');
    expect(loaderBar).toBeInTheDocument();
  });

  it('should use custom progressClass', () => {
    mockUseLoader.mockReturnValue({ loading: true });

    render(<LoaderBar progressClass="custom-progress" />);

    const progressBar = document.querySelector('.custom-progress');
    expect(progressBar).toBeInTheDocument();
  });

  it('should animate progress bar while loading', () => {
    mockUseLoader.mockReturnValue({ loading: true });

    render(<LoaderBar />);

    const progressBar = document.querySelector('.abp-progress') as HTMLElement;
    expect(progressBar).toBeInTheDocument();

    // Initial width should be 0%
    expect(progressBar.style.width).toBe('0%');

    // Advance time to trigger animation
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Width should have increased
    expect(progressBar.style.width).not.toBe('0%');
  });

  it('should complete progress to 100% when loading stops', () => {
    const { rerender } = render(<LoaderBar />);

    // Start loading
    mockUseLoader.mockReturnValue({ loading: true });
    rerender(<LoaderBar />);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Stop loading
    mockUseLoader.mockReturnValue({ loading: false });
    rerender(<LoaderBar />);

    const progressBar = document.querySelector('.abp-progress') as HTMLElement;
    expect(progressBar?.style.width).toBe('100%');
  });

  it('should hide after stopDelay when loading completes', () => {
    const { rerender, container } = render(<LoaderBar stopDelay={400} />);

    // Start loading
    mockUseLoader.mockReturnValue({ loading: true });
    rerender(<LoaderBar stopDelay={400} />);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(document.querySelector('.abp-loader-bar')).toBeInTheDocument();

    // Stop loading
    mockUseLoader.mockReturnValue({ loading: false });
    rerender(<LoaderBar stopDelay={400} />);

    // Still visible immediately after stop
    expect(document.querySelector('.abp-loader-bar')).toBeInTheDocument();

    // Advance past stopDelay
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Now should be hidden
    expect(container.firstChild).toBeNull();
  });

  // v1.1.0 - intervalPeriod and stopDelay tests
  describe('v1.1.0 - intervalPeriod prop', () => {
    it('should use default intervalPeriod of 300ms', () => {
      mockUseLoader.mockReturnValue({ loading: true });

      render(<LoaderBar />);

      const progressBar = document.querySelector('.abp-progress') as HTMLElement;

      // At 299ms, should not have advanced
      act(() => {
        vi.advanceTimersByTime(299);
      });

      const widthAt299 = progressBar.style.width;

      // At 300ms, should advance
      act(() => {
        vi.advanceTimersByTime(1);
      });

      const widthAt300 = progressBar.style.width;
      expect(widthAt300).not.toBe(widthAt299);
    });

    it('should respect custom intervalPeriod', () => {
      mockUseLoader.mockReturnValue({ loading: true });

      render(<LoaderBar intervalPeriod={500} />);

      const progressBar = document.querySelector('.abp-progress') as HTMLElement;

      // At 300ms (default), should still be at initial
      act(() => {
        vi.advanceTimersByTime(300);
      });

      const widthAt300 = progressBar.style.width;
      expect(widthAt300).toBe('0%');

      // At 500ms (custom), should advance
      act(() => {
        vi.advanceTimersByTime(200);
      });

      const widthAt500 = progressBar.style.width;
      expect(widthAt500).not.toBe('0%');
    });

    it('should animate faster with smaller intervalPeriod', () => {
      mockUseLoader.mockReturnValue({ loading: true });

      render(<LoaderBar intervalPeriod={100} />);

      const progressBar = document.querySelector('.abp-progress') as HTMLElement;

      // Advance 300ms - should have 3 interval ticks
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // With intervalPeriod=100, after 300ms we should have 3 ticks
      // Each tick adds 10 (for progress < 50), so ~30%
      const width = parseInt(progressBar.style.width);
      expect(width).toBeGreaterThanOrEqual(25);
    });

    it('should animate slower with larger intervalPeriod', () => {
      mockUseLoader.mockReturnValue({ loading: true });

      render(<LoaderBar intervalPeriod={600} />);

      const progressBar = document.querySelector('.abp-progress') as HTMLElement;

      // Advance 300ms - should have 0 ticks (first tick at 600ms)
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should still be at 0%
      expect(progressBar.style.width).toBe('0%');

      // Advance to 600ms - first tick
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(progressBar.style.width).toBe('10%');
    });
  });

  describe('v1.1.0 - stopDelay prop', () => {
    it('should use default stopDelay of 400ms', () => {
      // Start with loading true from the beginning
      mockUseLoader.mockReturnValue({ loading: true });
      const { rerender, container } = render(<LoaderBar />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(document.querySelector('.abp-loader-bar')).toBeInTheDocument();

      mockUseLoader.mockReturnValue({ loading: false });
      rerender(<LoaderBar />);

      // At 399ms after stop, should still be visible
      act(() => {
        vi.advanceTimersByTime(399);
      });

      expect(document.querySelector('.abp-loader-bar')).toBeInTheDocument();

      // At 400ms, should be hidden
      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(container.firstChild).toBeNull();
    });

    it('should respect custom stopDelay', () => {
      const { rerender, container } = render(<LoaderBar stopDelay={200} />);

      mockUseLoader.mockReturnValue({ loading: true });
      rerender(<LoaderBar stopDelay={200} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      mockUseLoader.mockReturnValue({ loading: false });
      rerender(<LoaderBar stopDelay={200} />);

      // At 199ms, should still be visible
      act(() => {
        vi.advanceTimersByTime(199);
      });

      expect(document.querySelector('.abp-loader-bar')).toBeInTheDocument();

      // At 200ms (custom), should be hidden
      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(container.firstChild).toBeNull();
    });

    it('should hide immediately with stopDelay=0', () => {
      const { rerender, container } = render(<LoaderBar stopDelay={0} />);

      mockUseLoader.mockReturnValue({ loading: true });
      rerender(<LoaderBar stopDelay={0} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      mockUseLoader.mockReturnValue({ loading: false });
      rerender(<LoaderBar stopDelay={0} />);

      // Should hide immediately (after 0ms timeout executes)
      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(container.firstChild).toBeNull();
    });

    it('should use longer stopDelay for slower fade out', () => {
      // Start with loading true from the beginning
      mockUseLoader.mockReturnValue({ loading: true });
      const { rerender, container } = render(<LoaderBar stopDelay={1000} />);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(document.querySelector('.abp-loader-bar')).toBeInTheDocument();

      mockUseLoader.mockReturnValue({ loading: false });
      rerender(<LoaderBar stopDelay={1000} />);

      // At 800ms, should still be visible
      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(document.querySelector('.abp-loader-bar')).toBeInTheDocument();

      // At 1000ms, should be hidden
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(container.firstChild).toBeNull();
    });
  });

  describe('progress bar animation behavior', () => {
    it('should slow down progress near 90%', () => {
      mockUseLoader.mockReturnValue({ loading: true });

      render(<LoaderBar intervalPeriod={10} />);

      // Advance to near 90%
      act(() => {
        vi.advanceTimersByTime(200);
      });

      const progressBar = document.querySelector('.abp-progress') as HTMLElement;
      const currentWidth = parseInt(progressBar.style.width);

      // Should have progressed significantly
      expect(currentWidth).toBeGreaterThan(50);
    });

    it('should not exceed 100% width', () => {
      mockUseLoader.mockReturnValue({ loading: true });

      render(<LoaderBar intervalPeriod={10} />);

      // Advance a very long time
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      const progressBar = document.querySelector('.abp-progress') as HTMLElement;
      const width = parseInt(progressBar.style.width);

      expect(width).toBeLessThanOrEqual(100);
    });
  });
});

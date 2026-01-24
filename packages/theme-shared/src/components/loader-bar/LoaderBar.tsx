import React, { useEffect, useRef, useState } from 'react';
import { useLoader } from '@abpjs/core';

export interface LoaderBarProps {
  /** CSS class for the container element */
  containerClass?: string;
  /** CSS class for the progress bar element */
  progressClass?: string;
  /** Custom filter function to determine if loading should be shown */
  filter?: (request: { url?: string; method?: string }) => boolean;
}

/**
 * A loading progress bar component that automatically shows/hides
 * based on HTTP request activity tracked by the loader state.
 *
 * @example
 * ```tsx
 * // Basic usage - place in your layout
 * <LoaderBar />
 *
 * // With custom classes
 * <LoaderBar
 *   containerClass="my-loader-container"
 *   progressClass="my-progress-bar"
 * />
 *
 * // With filter to only show for specific requests
 * <LoaderBar
 *   filter={(req) => !req.url?.includes('/api/silent')}
 * />
 * ```
 */
export function LoaderBar({
  containerClass = 'abp-loader-bar',
  progressClass = 'abp-progress',
  filter,
}: LoaderBarProps) {
  const { loading } = useLoader();
  const [isLoading, setIsLoading] = useState(false);
  const [progressLevel, setProgressLevel] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [loading]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setProgressLevel(0);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Animate progress bar
    intervalRef.current = setInterval(() => {
      setProgressLevel((prev) => {
        if (prev >= 90) {
          // Slow down near 90%
          return prev + 0.5;
        } else if (prev >= 75) {
          return prev + 2;
        } else if (prev >= 50) {
          return prev + 5;
        }
        return prev + 10;
      });
    }, 300);
  };

  const stopLoading = () => {
    // Complete the progress bar before hiding
    setProgressLevel(100);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Hide after animation completes
    setTimeout(() => {
      setIsLoading(false);
      setProgressLevel(0);
    }, 400);
  };

  if (!isLoading && progressLevel === 0) {
    return null;
  }

  return (
    <div
      className={containerClass}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
    >
      <div
        className={progressClass}
        style={{
          height: '100%',
          backgroundColor: '#3182ce',
          transition: 'width 0.3s ease-out',
          width: `${Math.min(progressLevel, 100)}%`,
        }}
      />
    </div>
  );
}

export default LoaderBar;

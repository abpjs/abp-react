import { ReactNode, useEffect, useRef, useState } from 'react';

export interface VisibilityProps {
  children: ReactNode;
  focusedElement?: HTMLElement | null;
}

/**
 * Component that hides itself when the focused element has no visible children
 * Equivalent to Angular's [abpVisibility] directive
 */
export function Visibility({ children, focusedElement }: VisibilityProps) {
  const [isVisible, setIsVisible] = useState(true);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (!focusedElement) return;

    const checkVisibility = () => {
      const htmlNodes = Array.from(focusedElement.childNodes).filter(
        (node) => node instanceof HTMLElement
      );
      setIsVisible(htmlNodes.length > 0);
    };

    // Initial check
    checkVisibility();

    // Set up mutation observer
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        checkVisibility();
      });
    });

    observerRef.current.observe(focusedElement, {
      childList: true,
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [focusedElement]);

  if (!isVisible) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Hook version for more flexibility
 */
export function useVisibility(focusedElement: HTMLElement | null): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!focusedElement) return;

    const checkVisibility = () => {
      const htmlNodes = Array.from(focusedElement.childNodes).filter(
        (node) => node instanceof HTMLElement
      );
      setIsVisible(htmlNodes.length > 0);
    };

    checkVisibility();

    const observer = new MutationObserver(() => {
      checkVisibility();
    });

    observer.observe(focusedElement, {
      childList: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [focusedElement]);

  return isVisible;
}

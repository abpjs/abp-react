import { ReactNode, useEffect, useRef, useState, CSSProperties } from 'react';

export interface EllipsisProps {
  /** Content to display with ellipsis truncation */
  children: ReactNode;
  /** Max width for the ellipsis container (default: '180px') */
  width?: string;
  /** Title attribute (falls back to inner text if not provided) */
  title?: string;
  /** Whether ellipsis is enabled (default: true) */
  enabled?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * Component that truncates text with ellipsis.
 * Equivalent to Angular's [abpEllipsis] directive.
 *
 * @example
 * ```tsx
 * <Ellipsis width="200px">
 *   This is a very long text that will be truncated
 * </Ellipsis>
 * ```
 */
export function Ellipsis({
  children,
  width = '180px',
  title: titleProp,
  enabled = true,
  className,
  style,
}: EllipsisProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [computedTitle, setComputedTitle] = useState<string>(titleProp || '');

  // Compute title from inner text if not provided
  useEffect(() => {
    if (!titleProp && ref.current && enabled) {
      // Use setTimeout to ensure content is rendered
      const timer = setTimeout(() => {
        if (ref.current) {
          const innerText = ref.current.innerText;
          if (innerText && innerText !== computedTitle) {
            setComputedTitle(innerText);
          }
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [titleProp, enabled, children, computedTitle]);

  if (!enabled) {
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  }

  const ellipsisStyle: CSSProperties = {
    maxWidth: width,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    ...style,
  };

  return (
    <span
      ref={ref}
      className={`abp-ellipsis ${className || ''}`.trim()}
      style={ellipsisStyle}
      title={titleProp || computedTitle}
    >
      {children}
    </span>
  );
}

/**
 * Hook version for applying ellipsis styles to custom elements.
 * Returns style object and ref to attach to the element.
 */
export function useEllipsis(options: {
  width?: string;
  enabled?: boolean;
} = {}) {
  const { width = '180px', enabled = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (ref.current && enabled) {
      const timer = setTimeout(() => {
        if (ref.current) {
          setTitle(ref.current.innerText);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [enabled]);

  const style: CSSProperties = enabled
    ? {
        maxWidth: width,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }
    : {};

  return {
    ref,
    style,
    title,
    className: enabled ? 'abp-ellipsis' : '',
  };
}

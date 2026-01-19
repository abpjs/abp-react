import React, { forwardRef, type ReactNode } from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

/**
 * Button color palette options
 */
export type ButtonColorPalette =
  | 'gray'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'cyan'
  | 'purple'
  | 'pink';

/**
 * Button variant options
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'plain';

/**
 * Button size options
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Button component props
 */
export interface ButtonProps {
  /** Button content */
  children: ReactNode;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Button variant */
  variant?: ButtonVariant;
  /** Color palette (replaces colorScheme from v2) */
  colorPalette?: ButtonColorPalette;
  /** Button size */
  size?: ButtonSize;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Text to display when loading */
  loadingText?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Additional CSS class */
  className?: string;
  /** Full width button */
  width?: string | number;
  /** Margin right */
  mr?: number | string;
  /** Margin left */
  ml?: number | string;
}

/**
 * Button - Wrapper component for buttons.
 *
 * This component wraps Chakra UI's Button and provides a simplified API
 * that maintains v2-like props while using v3 internally.
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button colorPalette="blue" onClick={handleSubmit}>
 *   Submit
 * </Button>
 *
 * // Outline button
 * <Button variant="outline" colorPalette="gray">
 *   Cancel
 * </Button>
 *
 * // Loading button
 * <Button loading loadingText="Submitting...">
 *   Submit
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      type = 'button',
      variant = 'solid',
      colorPalette = 'gray',
      size = 'md',
      disabled = false,
      loading = false,
      loadingText,
      onClick,
      className,
      width,
      mr,
      ml,
    },
    ref
  ): React.ReactElement {
    return (
      <ChakraButton
        ref={ref}
        type={type}
        variant={variant}
        colorPalette={colorPalette}
        size={size}
        disabled={disabled}
        loading={loading}
        loadingText={loadingText}
        onClick={onClick}
        className={className}
        width={width}
        mr={mr}
        ml={ml}
      >
        {children}
      </ChakraButton>
    );
  }
);

export default Button;

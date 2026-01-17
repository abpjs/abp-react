import React, { forwardRef, type ReactNode } from 'react';
import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';

/**
 * Checkbox color palette options
 */
export type CheckboxColorPalette =
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
 * Checkbox size options
 */
export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * Checkbox component props
 */
export interface CheckboxProps {
  /** Checkbox label */
  children?: ReactNode;
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether the checkbox is invalid */
  invalid?: boolean;
  /** Whether the checkbox is required */
  required?: boolean;
  /** Whether the checkbox is read-only */
  readOnly?: boolean;
  /** Color palette */
  colorPalette?: CheckboxColorPalette;
  /** Checkbox size */
  size?: CheckboxSize;
  /** HTML id */
  id?: string;
  /** HTML name */
  name?: string;
  /** Value for form submission */
  value?: string;
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Additional CSS class */
  className?: string;
}

/**
 * Checkbox - Wrapper component for checkboxes.
 *
 * This component wraps Chakra UI's Checkbox and provides a simplified API
 * that shields consumers from Chakra's compound component pattern.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Checkbox onChange={handleChange}>Remember me</Checkbox>
 *
 * // Controlled
 * <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}>
 *   Accept terms
 * </Checkbox>
 *
 * // With react-hook-form
 * <Checkbox {...register('remember')}>Remember me</Checkbox>
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      children,
      checked,
      defaultChecked,
      disabled = false,
      invalid = false,
      required = false,
      readOnly = false,
      colorPalette = 'blue',
      size = 'md',
      id,
      name,
      value,
      onChange,
      className,
    },
    ref
  ): React.ReactElement {
    return (
      <ChakraCheckbox.Root
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        invalid={invalid}
        required={required}
        readOnly={readOnly}
        colorPalette={colorPalette}
        size={size}
        className={className}
      >
        <ChakraCheckbox.HiddenInput
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
        />
        <ChakraCheckbox.Control />
        {children && <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>}
      </ChakraCheckbox.Root>
    );
  }
);

export default Checkbox;

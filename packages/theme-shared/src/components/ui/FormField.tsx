import React, { type ReactNode } from 'react';
import { Field } from '@chakra-ui/react';

/**
 * FormField component props
 */
export interface FormFieldProps {
  /** Field label */
  label?: ReactNode;
  /** Whether the field is invalid */
  invalid?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Error message to display when invalid */
  errorText?: ReactNode;
  /** Helper text displayed below the input */
  helperText?: ReactNode;
  /** The form input element(s) */
  children: ReactNode;
  /** HTML id for the label's htmlFor attribute */
  htmlFor?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * FormField - Wrapper component for form fields with label, error, and helper text.
 *
 * This component wraps Chakra UI's Field and provides a simplified API
 * that shields consumers from Chakra's compound component pattern.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FormField label="Username" invalid={!!errors.username} errorText={errors.username?.message}>
 *   <Input {...register('username')} />
 * </FormField>
 *
 * // With required indicator
 * <FormField label="Email" required>
 *   <Input type="email" />
 * </FormField>
 *
 * // With helper text
 * <FormField label="Password" helperText="Must be at least 8 characters">
 *   <Input type="password" />
 * </FormField>
 * ```
 */
export function FormField({
  label,
  invalid = false,
  required = false,
  disabled = false,
  errorText,
  helperText,
  children,
  htmlFor,
  className,
}: FormFieldProps): React.ReactElement {
  return (
    <Field.Root invalid={invalid} disabled={disabled} className={className}>
      {label && (
        <Field.Label htmlFor={htmlFor}>
          {label}
          {required && <Field.RequiredIndicator />}
        </Field.Label>
      )}
      {children}
      {helperText && !invalid && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
      {invalid && errorText && (
        <Field.ErrorText>{errorText}</Field.ErrorText>
      )}
    </Field.Root>
  );
}

export default FormField;

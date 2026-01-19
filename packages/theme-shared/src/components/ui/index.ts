/**
 * UI Component Wrappers
 *
 * These components wrap Chakra UI v3 components and provide a simplified,
 * stable API that shields consumers from Chakra's compound component patterns.
 *
 * Benefits:
 * - Library independence: Only theme-shared needs to know about Chakra internals
 * - Simpler API: No need for .Root, .Content, .Trigger patterns
 * - Easier upgrades: Changes to Chakra v4+ only affect these wrappers
 * - Consistent styling: ABP-specific defaults and styling applied here
 */

export * from './Alert';
export * from './Button';
export * from './Checkbox';
export * from './FormField';

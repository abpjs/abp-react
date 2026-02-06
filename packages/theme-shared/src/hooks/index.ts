// Re-export hooks from contexts for convenience
export { useToaster, useToasts, useToasterContext } from '../contexts/toaster.context';
export { useConfirmation, useConfirmationState, useConfirmationContext } from '../contexts/confirmation.context';
export { useErrorHandler } from '../handlers/error.handler';

// NavItems hook (v3.0.0+)
export { useNavItems } from './use-nav-items';

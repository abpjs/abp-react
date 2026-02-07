/**
 * Two-factor authentication behaviour options
 * Translated from @volo/abp.ng.identity eIdentityTwoFactorBehaviour
 * @since 3.2.0
 */
export enum eIdentityTwoFactorBehaviour {
  /** Two-factor authentication is optional for users */
  Optional = 0,
  /** Two-factor authentication is disabled */
  Disabled = 1,
  /** Two-factor authentication is required for all users */
  Forced = 2,
}

/**
 * Options array for two-factor behaviour select components
 * @since 3.2.0
 */
export const identityTwoFactorBehaviourOptions = [
  { label: 'Optional', value: eIdentityTwoFactorBehaviour.Optional },
  { label: 'Disabled', value: eIdentityTwoFactorBehaviour.Disabled },
  { label: 'Forced', value: eIdentityTwoFactorBehaviour.Forced },
] as const;

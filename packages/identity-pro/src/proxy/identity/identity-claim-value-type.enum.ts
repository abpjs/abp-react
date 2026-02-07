/**
 * Identity claim value types
 * Translated from @volo/abp.ng.identity IdentityClaimValueType
 * @since 3.2.0
 */
export enum IdentityClaimValueType {
  String = 0,
  Int = 1,
  Boolean = 2,
  DateTime = 3,
}

/**
 * Options array for claim value type select components
 * @since 3.2.0
 */
export const identityClaimValueTypeOptions = [
  { label: 'String', value: IdentityClaimValueType.String },
  { label: 'Int', value: IdentityClaimValueType.Int },
  { label: 'Boolean', value: IdentityClaimValueType.Boolean },
  { label: 'DateTime', value: IdentityClaimValueType.DateTime },
] as const;

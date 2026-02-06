/**
 * Navigation element name constants.
 * Used for identifying built-in navigation elements in the layout.
 *
 * @since 2.7.0
 * @deprecated This enum was removed in Angular v3.0.0. Nav items are now
 * managed via NavItemsService from @abpjs/theme-shared. This export is kept
 * for backwards compatibility and will be removed in a future version.
 * Use NavItemsService instead.
 */
export const eNavigationElementNames = {
  Language: 'LanguageRef',
  User: 'CurrentUserRef',
} as const;

/**
 * Type for eNavigationElementNames values
 */
export type eNavigationElementNames =
  (typeof eNavigationElementNames)[keyof typeof eNavigationElementNames];

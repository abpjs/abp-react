/**
 * Navigation element name constants.
 * Used for identifying built-in navigation elements in the layout.
 *
 * @since 2.7.0
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

/**
 * Profile picture type enum for the Account Pro module.
 * Defines the source type of a user's profile picture.
 * @since 3.2.0
 */
export enum ProfilePictureType {
  /**
   * No profile picture set.
   */
  None = 0,

  /**
   * Profile picture from Gravatar service.
   */
  Gravatar = 1,

  /**
   * Custom uploaded image.
   */
  Image = 2,
}

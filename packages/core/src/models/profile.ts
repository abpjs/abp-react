/* eslint-disable @typescript-eslint/no-namespace */
import type { ExtensibleObject } from './dtos';

export namespace Profile {
  export interface State {
    profile: Response;
  }

  export interface Response extends Partial<ExtensibleObject> {
    userName: string;
    email: string;
    name: string;
    surname: string;
    phoneNumber: string;
    /**
     * Whether the user is authenticated through an external provider
     * @since 3.1.0
     */
    isExternal?: boolean;
    /**
     * Whether the user has a password set
     * @since 3.1.0
     */
    hasPassword?: boolean;
    /**
     * Whether the user's email is confirmed
     * @since 3.1.0
     */
    emailConfirmed?: boolean;
    /**
     * Whether the user's phone number is confirmed
     * @since 3.1.0
     */
    phoneNumberConfirmed?: boolean;
  }

  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }
}

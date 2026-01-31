import { RootState } from '../store';
import { Profile } from '../models';

/**
 * ProfileStateService provides access to profile state.
 * @since 1.1.0
 */
export class ProfileStateService {
  constructor(private getState: () => RootState) {}

  /**
   * Get the current user's profile
   */
  getProfile(): Profile.Response | null {
    return this.getState().profile.profile;
  }
}

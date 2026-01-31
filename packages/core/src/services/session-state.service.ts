import { RootState } from '../store';
import { ABP } from '../models';

/**
 * SessionStateService provides access to session state.
 * @since 1.1.0
 */
export class SessionStateService {
  constructor(private getState: () => RootState) {}

  /**
   * Get the current language
   */
  getLanguage(): string {
    return this.getState().session.language;
  }

  /**
   * Get the current tenant
   */
  getTenant(): ABP.BasicItem {
    return this.getState().session.tenant;
  }
}

import { RootState } from '../store';
import { ABP, Session } from '../models';

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

  /**
   * Get the session detail information
   * @since 2.0.0
   */
  getSessionDetail(): Session.SessionDetail {
    return this.getState().session.sessionDetail;
  }
}

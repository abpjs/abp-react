/**
 * SessionStateService provides access to session state.
 * @since 1.1.0
 * @updated 4.0.0 - Uses CurrentTenantDto instead of ABP.BasicItem, added setTenant/setLanguage methods
 */

import { RootState } from '../store';
import { Session } from '../models';
import { CurrentTenantDto } from '../models/proxy/multi-tenancy';
import type { Dispatch } from '@reduxjs/toolkit';
import { sessionActions } from '../slices/session.slice';

export class SessionStateService {
  constructor(
    private getState: () => RootState,
    private dispatch?: Dispatch
  ) {}

  /**
   * Get the current language
   */
  getLanguage(): string {
    return this.getState().session.language;
  }

  /**
   * Get the current tenant
   * @updated 4.0.0 - Returns CurrentTenantDto instead of ABP.BasicItem
   */
  getTenant(): CurrentTenantDto {
    return this.getState().session.tenant;
  }

  /**
   * Get the session detail information
   * @since 2.0.0
   */
  getSessionDetail(): Session.SessionDetail {
    return this.getState().session.sessionDetail;
  }

  /**
   * Set the current tenant
   * @since 4.0.0
   */
  setTenant(tenant: CurrentTenantDto): void {
    if (!this.dispatch) {
      throw new Error(
        'Dispatch not configured. SessionStateService requires dispatch for setTenant.'
      );
    }
    this.dispatch(sessionActions.setTenant(tenant));
  }

  /**
   * Set the current language
   * @since 4.0.0
   */
  setLanguage(language: string): void {
    if (!this.dispatch) {
      throw new Error(
        'Dispatch not configured. SessionStateService requires dispatch for setLanguage.'
      );
    }
    this.dispatch(sessionActions.setLanguage(language));
  }
}

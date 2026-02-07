/**
 * EnvironmentService - Service for managing environment configuration
 * Translated from @abp/ng.core v4.0.0
 *
 * @since 4.0.0
 */

import { RootState } from '../store';
import { Environment } from '../models/environment';
import type { Dispatch } from '@reduxjs/toolkit';
import { configActions } from '../slices/config.slice';

export class EnvironmentService {
  constructor(
    private getState: () => RootState,
    private dispatch?: Dispatch
  ) {}

  /**
   * Get the full environment configuration
   */
  getEnvironment(): Partial<Environment> {
    return this.getState().config.environment as Partial<Environment>;
  }

  /**
   * Get the API URL for a given API key
   * @param key - The API key (default: 'default')
   */
  getApiUrl(key: string = 'default'): string {
    return this.getState().config.environment.apis?.[key]?.url || '';
  }

  /**
   * Set the environment state
   * @param environment - The environment configuration to set
   */
  setState(environment: Environment): void {
    if (!this.dispatch) {
      throw new Error(
        'Dispatch not configured. EnvironmentService requires dispatch for setState.'
      );
    }
    this.dispatch(configActions.setEnvironment(environment));
  }
}

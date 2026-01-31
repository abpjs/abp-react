import { ABP } from './common';

export namespace Session {
  export interface State {
    language: string;
    tenant: ABP.BasicItem;
    /**
     * Session detail information
     * @since 2.0.0
     */
    sessionDetail: SessionDetail;
  }

  /**
   * Session detail information for tracking session state
   * @since 2.0.0
   */
  export interface SessionDetail {
    /**
     * Number of currently opened tabs/windows
     */
    openedTabCount: number;
    /**
     * Timestamp of last exit time
     */
    lastExitTime: number;
    /**
     * Whether to remember the session
     */
    remember: boolean;
  }
}

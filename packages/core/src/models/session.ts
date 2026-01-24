import { ABP } from './common';

export namespace Session {
  export interface State {
    language: string;
    tenant: ABP.BasicItem;
  }
}

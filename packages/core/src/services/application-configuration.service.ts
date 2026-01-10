import { ApplicationConfiguration } from '../models';
import { RestService } from './rest.service';

export class ApplicationConfigurationService {
  constructor(private rest: RestService) {}

  getConfiguration(): Promise<ApplicationConfiguration.Response> {
    return this.rest.get<ApplicationConfiguration.Response>('/api/abp/application-configuration');
  }
}

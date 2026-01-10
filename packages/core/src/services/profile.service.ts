import { Profile } from '../models';
import { RestService } from './rest.service';

export class ProfileService {
  constructor(private rest: RestService) {}

  get(): Promise<Profile.Response> {
    return this.rest.get<Profile.Response>('/api/identity/profile');
  }

  update(body: Profile.Response): Promise<Profile.Response> {
    return this.rest.put<Profile.Response, Profile.Response>('/api/identity/profile', body);
  }

  changePassword(body: Profile.ChangePasswordRequest): Promise<void> {
    return this.rest.post<Profile.ChangePasswordRequest, void>(
      '/api/identity/profile/changePassword',
      body
    );
  }
}

import { Profile } from '../models';
import { RestService } from './rest.service';

export class ProfileService {
  constructor(private rest: RestService) {}

  get(): Promise<Profile.Response> {
    return this.rest.get<Profile.Response>('/api/identity/my-profile');
  }

  update(body: Profile.Response): Promise<Profile.Response> {
    return this.rest.put<Profile.Response, Profile.Response>('/api/identity/my-profile', body);
  }

  changePassword(body: Profile.ChangePasswordRequest, skipHandleError?: boolean): Promise<void> {
    return this.rest.post<Profile.ChangePasswordRequest, void>(
      '/api/identity/my-profile/changePassword',
      body,
      { skipHandleError }
    );
  }
}

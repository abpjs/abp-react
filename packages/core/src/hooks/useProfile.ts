import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  profileActions,
  selectProfile,
  selectProfileLoading,
  selectProfileError,
} from '../slices/profile.slice';
import { useProfileService } from '../contexts/abp.context';
import { Profile } from '../models';

/**
 * Hook to manage user profile
 */
export function useProfile() {
  const dispatch = useDispatch();
  const profileService = useProfileService();
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  const fetchProfile = useCallback(async () => {
    dispatch(profileActions.setLoading(true));
    dispatch(profileActions.setError(null));
    try {
      const data = await profileService.get();
      dispatch(profileActions.setProfile(data));
      return data;
    } catch (err: any) {
      dispatch(profileActions.setError(err.message || 'Failed to fetch profile'));
      throw err;
    } finally {
      dispatch(profileActions.setLoading(false));
    }
  }, [dispatch, profileService]);

  const updateProfile = useCallback(
    async (data: Profile.Response) => {
      dispatch(profileActions.setLoading(true));
      dispatch(profileActions.setError(null));
      try {
        const updated = await profileService.update(data);
        dispatch(profileActions.setProfile(updated));
        return updated;
      } catch (err: any) {
        dispatch(profileActions.setError(err.message || 'Failed to update profile'));
        throw err;
      } finally {
        dispatch(profileActions.setLoading(false));
      }
    },
    [dispatch, profileService]
  );

  const changePassword = useCallback(
    async (data: Profile.ChangePasswordRequest) => {
      dispatch(profileActions.setLoading(true));
      dispatch(profileActions.setError(null));
      try {
        await profileService.changePassword(data);
      } catch (err: any) {
        dispatch(profileActions.setError(err.message || 'Failed to change password'));
        throw err;
      } finally {
        dispatch(profileActions.setLoading(false));
      }
    },
    [dispatch, profileService]
  );

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
  };
}

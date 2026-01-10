import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions, selectLanguage } from '../slices/session.slice';

/**
 * Hook to manage session state (language, etc.)
 */
export function useSession() {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);

  const setLanguage = useCallback(
    (lang: string) => {
      dispatch(sessionActions.setLanguage(lang));
    },
    [dispatch]
  );

  return {
    language,
    setLanguage,
  };
}

import { useSelector } from 'react-redux';
import { selectLoading, selectLoadingCount, selectRequests } from '../slices/loader.slice';

/**
 * Hook to access loader state.
 * Returns loading status based on active HTTP requests.
 */
export function useLoader() {
  const loading = useSelector(selectLoading);
  const loadingCount = useSelector(selectLoadingCount);
  const requests = useSelector(selectRequests);

  return {
    /** Whether any requests are currently loading */
    loading,
    /** Number of active loading requests */
    loadingCount,
    /** List of request identifiers currently loading */
    requests,
  };
}

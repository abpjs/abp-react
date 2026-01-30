import { describe, it, expect } from 'vitest';
import {
  loaderReducer,
  loaderActions,
  LoaderState,
  selectLoading,
  selectLoadingCount,
  selectRequests,
} from './loader.slice';

describe('loader.slice', () => {
  const initialState: LoaderState = {
    loading: 0,
    requests: [],
  };

  describe('reducers', () => {
    describe('start', () => {
      it('should increment loading count', () => {
        const state = loaderReducer(initialState, loaderActions.start());
        expect(state.loading).toBe(1);
      });

      it('should add request id when provided', () => {
        const state = loaderReducer(initialState, loaderActions.start({ id: 'request-1' }));
        expect(state.loading).toBe(1);
        expect(state.requests).toContain('request-1');
      });

      it('should handle multiple starts', () => {
        let state = loaderReducer(initialState, loaderActions.start({ id: 'request-1' }));
        state = loaderReducer(state, loaderActions.start({ id: 'request-2' }));
        expect(state.loading).toBe(2);
        expect(state.requests).toHaveLength(2);
      });

      it('should handle start without payload', () => {
        const state = loaderReducer(initialState, loaderActions.start(undefined));
        expect(state.loading).toBe(1);
        expect(state.requests).toHaveLength(0);
      });
    });

    describe('stop', () => {
      it('should decrement loading count', () => {
        const stateWithLoading: LoaderState = { loading: 2, requests: [] };
        const state = loaderReducer(stateWithLoading, loaderActions.stop());
        expect(state.loading).toBe(1);
      });

      it('should not go below zero', () => {
        const state = loaderReducer(initialState, loaderActions.stop());
        expect(state.loading).toBe(0);
      });

      it('should remove request id when provided', () => {
        const stateWithRequests: LoaderState = {
          loading: 2,
          requests: ['request-1', 'request-2'],
        };
        const state = loaderReducer(
          stateWithRequests,
          loaderActions.stop({ id: 'request-1' })
        );
        expect(state.loading).toBe(1);
        expect(state.requests).not.toContain('request-1');
        expect(state.requests).toContain('request-2');
      });

      it('should handle stop with non-existent id', () => {
        const stateWithRequests: LoaderState = {
          loading: 1,
          requests: ['request-1'],
        };
        const state = loaderReducer(
          stateWithRequests,
          loaderActions.stop({ id: 'nonexistent' })
        );
        expect(state.loading).toBe(0);
        expect(state.requests).toHaveLength(1);
      });
    });
  });

  describe('selectors', () => {
    describe('selectLoading', () => {
      it('should return false when loading is 0', () => {
        const state = { loader: { loading: 0, requests: [] } };
        expect(selectLoading(state)).toBe(false);
      });

      it('should return true when loading is greater than 0', () => {
        const state = { loader: { loading: 1, requests: [] } };
        expect(selectLoading(state)).toBe(true);
      });
    });

    describe('selectLoadingCount', () => {
      it('should return loading count', () => {
        const state = { loader: { loading: 5, requests: [] } };
        expect(selectLoadingCount(state)).toBe(5);
      });
    });

    describe('selectRequests', () => {
      it('should return requests array', () => {
        const requests = ['req-1', 'req-2'];
        const state = { loader: { loading: 2, requests } };
        expect(selectRequests(state)).toBe(requests);
      });
    });
  });
});

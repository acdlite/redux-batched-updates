/* eslint-disable */
import { unstable_batchedUpdates as unstableBatchedUpdates } from 'react-dom';
/* eslint-enable */

export function batchedUpdatesMiddleware() {
  return next => action => unstableBatchedUpdates(() => next(action));
}

export function batchedUpdates(next) {
  return (...args) => {
    const store = next(...args);
    return {
      ...store,
      dispatch: batchedUpdatesMiddleware()(store.dispatch)
    };
  };
}

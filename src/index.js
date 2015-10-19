/*eslint camelcase: 0*/
import { unstable_batchedUpdates as reactBatchedUpdates } from 'react-dom';

export function batchedUpdatesMiddleware() {
  return next => action => reactBatchedUpdates(() => next(action));
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

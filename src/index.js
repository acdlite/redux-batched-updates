import { addons } from 'react/addons';

export function batchedUpdatesMiddleware() {
  return next => action => addons.batchedUpdates(() => next(action));
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

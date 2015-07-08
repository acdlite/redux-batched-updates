import React from 'react/addons';

const { batchedUpdates } = React.addons;

export function batchedUpdatesMiddleware() {
  return next => action => batchedUpdates(() => next(action));
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

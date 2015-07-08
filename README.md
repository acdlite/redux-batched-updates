redux-batched-updates
=====================

[![build status](https://img.shields.io/travis/acdlite/redux-batched-updates/master.svg?style=flat-square)](https://travis-ci.org/acdlite/redux-batched-updates)
[![npm version](https://img.shields.io/npm/v/redux-batched-updates.svg?style=flat-square)](https://www.npmjs.com/package/redux-batched-updates)

Batch React updates that occur as a result of Redux dispatches, to prevent cascading renders. See https://github.com/gaearon/redux/issues/125 for more details.

```js
npm install --save redux-batched-updates
```

## Usage

```js
// Use as higher-order store
import { batchedUpdates } from 'redux-batched-updates';
const store = batchedUpdates(createStore)(reducer, intialState);

// Or as middleware
import { batchedUpdatesMiddleware } from 'redux-batched-updates';
const m = composeMiddleware(thunk, promise, batchedUpdatesMiddleware);
const store = applyMiddleware(m)(createStore)(reducer, initialState)
```

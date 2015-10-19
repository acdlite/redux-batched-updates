import { batchedUpdates } from '../';
import { Provider, Connector } from 'redux/react';
import { createRedux, bindActionCreators } from 'redux';
import React from 'react';
import jsdom from './jsdom';
import TestUtils from 'react-addons-test-utils';
import { spy } from 'sinon';

const actionCreators = {
  addTodo(text) {
    return { type: 'ADD_TODO', payload: text };
  }
};

function todoReducer(state = { todos: [] }, action = {}) {
  return action.type === 'ADD_TODO'
    ? { ...state, todos: [...state.todos, action.payload] }
    : state;
}

function testBatchedUpdates(createStore) {
  const store = createStore({ todos: todoReducer });

  const renderSpy = spy();
  const tree = TestUtils.renderIntoDocument(
    <Provider redux={store}>
      {() =>
        <Connector select={() => ({ f: () => {} })}>
        {() =>
          <Connector select={({ todos }) => ({ ...todos, f: () => {} })}>
            {({ dispatch, ...props }) => {
              const { addTodo } = bindActionCreators(actionCreators, dispatch);
              renderSpy(props.todos, addTodo);
              return <div {...props} addTodo={addTodo} />;
            }}
          </Connector>
        }
        </Connector>
      }
    </Provider>
  );

  const div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');

  let todos = null;
  let addTodo = null;

  expect(renderSpy.callCount).to.equal(1);
  ([todos, addTodo] = renderSpy.getCall(0).args);
  expect(todos).to.deep.equal([]);

  addTodo('Use Redux');
  expect(renderSpy.callCount).to.equal(2);
  ([todos, addTodo] = renderSpy.getCall(1).args);
  expect(todos).to.deep.equal([ 'Use Redux' ]);

  addTodo('Use RxJS');
  expect(renderSpy.callCount).to.equal(3);
  ([todos] = renderSpy.getCall(2).args);
  expect(todos).to.deep.equal([ 'Use Redux', 'Use RxJS' ]);
}

describe('batchedUpdates()', () => {
  jsdom();

  it('prevents extra renders after dispatches', () => {
    expect(() => testBatchedUpdates(createRedux)).to.throw();
    testBatchedUpdates(batchedUpdates(createRedux));
  });
});

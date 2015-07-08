import { batchedUpdates } from '../';
import { Provider, Connector } from 'redux/react';
import { createRedux, bindActionCreators } from 'redux';
import React from 'react/addons';
import jsdom from './jsdom';
const { TestUtils } = React.addons;
import { spy } from 'sinon';

const actionCreators = {
  addTodo(text) {
    return { type: 'ADD_TODO', payload: text };
  }
};

function todoReducer(state = { todos: [] }, action) {
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
              renderSpy();
              const { addTodo } = bindActionCreators(actionCreators, dispatch);
              return <div {...props} addTodo={addTodo} />;
            }}
          </Connector>
        }
        </Connector>
      }
    </Provider>
  );

  const div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');
  expect(renderSpy.callCount).to.equal(1);
  expect(div.props.todos).to.deep.equal([]);
  div.props.addTodo('Use Redux');
  expect(renderSpy.callCount).to.equal(2);
  expect(div.props.todos).to.deep.equal([ 'Use Redux' ]);
  div.props.addTodo('Use RxJS');
  expect(renderSpy.callCount).to.equal(3);
  expect(div.props.todos).to.deep.equal([ 'Use Redux', 'Use RxJS' ]);
}

describe('batchedUpdates()', () => {
  jsdom();

  it('prevents extra renders after dispatches', () => {
    expect(() => testBatchedUpdates(createRedux)).to.throw();
    testBatchedUpdates(batchedUpdates(createRedux));
  });
});

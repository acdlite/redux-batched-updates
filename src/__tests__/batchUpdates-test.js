import { batchedUpdates } from '../';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import React, {Component} from 'react';
import jsdom from './jsdom';
import TestUtils from 'react-addons-test-utils';
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

function testBatchedUpdates(middleware) {
  const store = middleware(createStore)(todoReducer);

  const renderSpy = spy();
  const { addTodo } = bindActionCreators(actionCreators, store.dispatch);
  class TestComponent extends Component {
    render() {
      renderSpy();
      return <div {...this.props} addTodo={addTodo} />;
    }
  }
  const ConnectedComponent = connect(state => {
    return { todos: state.todos, f: () => {} };
  })(TestComponent);
  const tree = TestUtils.renderIntoDocument(
    <ConnectedComponent store={store} />
  );

  const div = TestUtils.findRenderedDOMComponentWithTag(tree, 'div');
  expect(renderSpy.callCount).to.equal(1);
  expect(store.getState().todos).to.deep.equal([]);
  addTodo('Use Redux');
  expect(renderSpy.callCount).to.equal(2);
  expect(store.getState().todos).to.deep.equal([ 'Use Redux' ]);
  addTodo('Use RxJS');
  expect(renderSpy.callCount).to.equal(3);
  expect(store.getState().todos).to.deep.equal([ 'Use Redux', 'Use RxJS' ]);
}

describe('batchedUpdates()', () => {
  jsdom();

  it('prevents extra renders after dispatches', () => {
    expect(() => testBatchedUpdates(data => data)).to.throw();
    testBatchedUpdates(batchedUpdates);
  });
});

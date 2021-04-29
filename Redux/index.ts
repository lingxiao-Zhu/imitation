import createStore from './createStore';
import combineReducers from './combineReducers';
import applyMiddleware from './applyMiddleware';

const reducer1 = (state = {}, action) => {
  switch (action.type) {
    case 'ADD':
      return state;
    default:
      return state;
  }
};

const reducer2 = (state = {}, action) => {
  switch (action.type) {
    case 'ADD':
      return state;
    default:
      return state;
  }
};

// middleware
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const finalReducer = combineReducers({
  reducer1,
  reducer2,
});

const store = createStore(finalReducer);

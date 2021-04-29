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
const logger1 = store => next => action => {
  console.log('logger1', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const logger2 = store => next => action => {
  console.log('logger2', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const enhancer = applyMiddleware(logger1, logger2)

const finalReducer = combineReducers({
  reducer1,
  reducer2,
});

const store = createStore(finalReducer, enhancer);

store.dispatch({})

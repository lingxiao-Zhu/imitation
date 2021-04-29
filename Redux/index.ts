import createStore from './createStore';
import combineReducers from './combineReducers';
import applyMiddleware from './applyMiddleware';
import compose from './compose';

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

const finalReducer = combineReducers({
  reducer1,
  reducer2,
});

const store = createStore(finalReducer);


export default function applyMiddleware(...middlewares) {
  return function(createStore){
    return function(reducer, preloadedState){
      const store = createStore(reducer, preloadedState);

      let dispatch:any = () => {};

      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      }

      const chain = middlewares.map(middleware => middleware(middlewareAPI));
      dispatch = compose(...chain)(store.dispatch)

      return {
        ...store,
        dispatch
      }

    }
  }
}

function compose(...fns: Function[]){
 return fns.reduce((a,b)=> (...args) => a(b(...args)))
}


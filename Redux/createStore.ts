/**
 *
 * @param reducer
 * @param preloadedState
 * @param enhancer
 */
export default function createStore(reducer, preloadedState?, enhancer?) {
  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners: (() => void)[] | null = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if(typeof enhancer === 'function'){
    return enhancer(createStore)(reducer, preloadedState)
  }

  /*
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getState() {
    return currentState;
  }

  function subscribe(listener: () => void) {
    let isSubscribed = true;
    ensureCanMutateNextListeners();
    return function unsubscribe() {
      if (!isSubscribed) return;
      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing.');
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }

  function dispatch(action) {
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } catch (e) {
    } finally {
      isDispatching = false;
    }

    const listeners = (currentListeners = nextListeners);

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }

    return action;
  }

  const store = {
    dispatch,
    subscribe,
    getState,
  };
  return store;
}

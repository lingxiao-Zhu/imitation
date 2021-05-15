import React, { useMemo } from 'react';
import { ReactReduxContext } from './Context';

function Provider({ store, children }) {
  const contextValue = useMemo(() => {
    const subscription = new Subscription(store);
    subscription.onStateChange = subscription.notifyNestedSubs;
    return {
      store,
      subscription,
    };
  }, [store]);

  const Context = ReactReduxContext;

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

function Subscription(store) {}

export default Provider;

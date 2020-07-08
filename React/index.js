import React, { useState } from './React';
import ReactDOM from './ReactDOM';

function Counter() {
  const [state, setState] = useState(1);
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
}

const container = document.getElementById('root');

ReactDOM.render(<Counter />, container);

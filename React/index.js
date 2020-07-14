import React from './React';
import ReactDOM from './ReactDOM';

function Counter() {
  const [state, setState] = ReactDOM.useState(1);

  return (
    <div>
      <h1 title="1">Count: {state}</h1>
      <button onClick={() => setState((c) => c + 1)}>add 1</button>
    </div>
  );
}

const container = document.getElementById('root');

ReactDOM.render(<Counter />, container);

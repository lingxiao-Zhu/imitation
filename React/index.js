import React from './react';
import ReactDOM from './react-dom';

function App(props) {
  return <h1>Hi {props.name}</h1>;
}

const container = document.getElementById('root');

ReactDOM.render(<App name="foo" />, container);

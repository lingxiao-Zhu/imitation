import React from './react';
import ReactDOM from './react-dom';

const App = (
  <div id="1">
    <h1>11</h1>
  </div>
);

const App2 = (
  <p id="1">
    <h1>121</h1>
    <h1>122</h1>
  </p>
);

const container = document.getElementById('root');

ReactDOM.render(App, container);

setTimeout(() => {
  ReactDOM.render(App2, container);
}, 2000);

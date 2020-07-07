import React from './react';
import ReactDOM from './react-dom';

const element = React.createElement('h1', { title: 'foo' }, 'Hello');
const container = document.getElementById('root');
ReactDOM.render(element, container);

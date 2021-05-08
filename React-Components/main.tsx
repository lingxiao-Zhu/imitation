import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import './main.css';

function App() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button onClick={() => setVisible(true)}>open modal</button>
      <Modal visible={visible} />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

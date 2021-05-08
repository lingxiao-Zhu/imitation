import React, { useEffect, useState } from 'react';
import Mask from './Mask';

type IProps = {
  visible: boolean;
  onVisibleChanged: (visible: boolean) => void;
};

function Content({ visible, onVisibleChanged }: IProps) {
  const handleCancel = () => {
    onVisibleChanged(false);
  };

  return (
    <div className="rc-modal-content">
      <h1>title</h1>
      <p>content</p>
      <footer>
        <button>确认</button>
        <button onClick={handleCancel}>取消</button>
      </footer>
    </div>
  );
}

export default Content;

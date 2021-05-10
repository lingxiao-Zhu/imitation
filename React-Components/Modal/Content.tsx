import React, { useEffect, useState } from 'react';

type IProps = {
  visible: boolean;
  onCancel: () => void;
  onVisibleChanged: (visible: boolean) => void;
};

function Content({ visible, onVisibleChanged, onCancel }: IProps) {
  const handleCancel = () => {
    onCancel();
    // after animation
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

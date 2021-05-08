import React, { useEffect, useState } from 'react';
import Portal from './Portal';
import Mask from './Mask';
import Content from './Content';

type IProps = {
  visible: boolean;
};

function Modal({ visible }: IProps) {
  const [animatedVisible, setAnimatedVisible] = useState(visible);

  const onDialogVisibleChanged = (newVisible: boolean) => {
    if (!newVisible) {
      setAnimatedVisible(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setAnimatedVisible(true);
    }
    return () => {};
  }, [visible]);

  return (
    <Portal visible={visible}>
      <div className="rc-modal-root">
        <Mask visible={visible} />
        <div className="rc-modal-warp" style={{ display: !animatedVisible ? 'none' : null }}>
          <Content visible={visible} onVisibleChanged={onDialogVisibleChanged} />
        </div>
      </div>
    </Portal>
  );
}

export default Modal;

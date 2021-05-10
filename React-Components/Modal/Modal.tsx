import React, { useEffect, useState } from 'react';
import Portal from './Portal';
import Content from './Content';

type IProps = {
  visible: boolean;
  onCancel: () => void;
};

function Modal({ visible, onCancel }: IProps) {
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
    // Portal 初始化后，就一直存在不被销毁
    <Portal visible={visible}>
      <div className="rc-modal-root">
        {visible && <div className="rc-modal-mask"></div>}
        <div className="rc-modal-warp" style={{ display: !animatedVisible ? 'none' : null }}>
          <Content onCancel={onCancel} visible={visible} onVisibleChanged={onDialogVisibleChanged} />
        </div>
      </div>
    </Portal>
  );
}

export default Modal;

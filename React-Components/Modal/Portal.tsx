import React, { useRef, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

type IProps = {
  visible: boolean;
};

function Portal({ visible, children }: PropsWithChildren<IProps>) {
  const componentRef = useRef(null);

  const getContainer = () => {
    if (componentRef.current) return componentRef.current;
    const container = document.createElement('div');
    document.body.append(container);
    componentRef.current = container;
    return container;
  };

  let portal = null;

  // 懒加载，刚开始不渲染dom，visible 变为 true 后复用。
  if (visible || componentRef.current) {
    const container = getContainer();
    componentRef.current;
    portal = createPortal(children, container);
  }

  return portal;
}

export default Portal;

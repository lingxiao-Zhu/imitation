import React from 'react';

type IProps = {
  visible: boolean;
};

function Mask({ visible }: IProps) {
  return visible && <div className="rc-modal-mask"></div>;
}

export default Mask;

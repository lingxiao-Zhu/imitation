import { useContext } from 'react';
import StoreContext from './Context';

function connect(mapStateToProps, mapDispatchToProps) {
  return function connectHOC(WrappedComponent) {
    return function connectHOC(props) {
      // 复制一份props到wrapperProps
      const { ...wrapperProps } = props;
      // 获取context的值
      const context = useContext(StoreContext);

      const { store } = context; // 解构出store
      const state = store.getState(); // 拿到state

      // 执行mapStateToProps和mapDispatchToProps
      const stateProps = mapStateToProps(state);
      const dispatchProps = mapDispatchToProps(store.dispatch);

      // 组装最终的props
      const actualChildProps = Object.assign({}, stateProps, dispatchProps, wrapperProps);

      // 渲染WrappedComponent
      return <WrappedComponent {...actualChildProps} />;
    };
  };
}

export default connect;

import React from 'react';

const { Consumer, Provider } = React.createContext();

class BrowserRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPath: window.location.pathname,
    };
  }

  onChangeView = () => {
    this.setState({ currentPath: window.location.pathname });
  };

  componentDidMount() {
    window.addEventListener('popstate', this.onChangeView);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.onChangeView);
  }

  render() {
    return (
      <Provider value={{ currentPath: this.state.currentPath, onChangeView: this.onChangeView }}>
        <div>
          {React.Children.map(this.props.children, (child) => {
            return child;
          })}
        </div>
      </Provider>
    );
  }
}

class Route extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { path, render } = this.props;
    return <Consumer>{({ currentPath }) => currentPath === path && render()}</Consumer>;
  }
}

class Link extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { to, ...props } = this.props;

    return (
      <Consumer>
        {({ onChangeView }) => (
          <a
            {...props}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, '', to);
              onChangeView();
            }}
          ></a>
        )}
      </Consumer>
    );
  }
}

function App() {
  <div>
    <Link to="home" />
    <Link to="home1" />
    <Link to="home2" />
    <BrowserRouter>
      <Route path="home" render={() => 1}></Route>
      <Route path="home1" render={() => 1}></Route>
      <Route path="home2" render={() => 1}></Route>
    </BrowserRouter>
    ;
  </div>;
}

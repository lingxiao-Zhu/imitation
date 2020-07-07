// const element = <h1 title="foo">Hello</h1>;
const React = {}
const ReactDOM = {}

const element = React.createElement(
  "h1",
  { title: "foo" },
  "Hello"
)

  // const element = {
  //   type: "h1",
  //   props: {
  //     title: "foo",
  //     children: "Hello",
  //   },
  // }
  ​
const container = document.getElementById('root');
ReactDOM.render(element, container);

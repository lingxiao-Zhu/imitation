import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import ScriptVisitor from './scriptVisitor';

export const CardCycle: Record<string, string | undefined> = {
  onReady: 'componentDidMount',
};

export default function scriptIterator(script: string, name: string) {
  const visitor = new ScriptVisitor(name);

  const vast = parse(script, {
    sourceType: 'module',
  });

  // collect props and data key firstly
  traverse(vast, {
    ObjectProperty(path: NodePath<t.ObjectProperty>) {
      const parent = path.parentPath.parent;
      const name = (path.node.key as t.Identifier).name;
      if (t.isCallExpression(parent) && (parent.callee as t.Identifier).name === 'Page') {
        // 顶级的 ObjectProperty；比如 data/properties 等
        switch (name) {
          // opt.data
          case 'data':
            const node = path.node.value;
            if (t.isObjectExpression(node)) {
              visitor.dataHandler(node.properties);
              // Support following syntax:
              // data: {a: 1}
              // visitor.dataHandler(node.properties, true);
            }
            break;
          // opt.props
          // case 'properties':
          //   visitor.propsHandler(path);
          //   break;
          default:
            // visitor.customObjectPropertyHandler(path);
            break;
        }
      }
    },
  });
}

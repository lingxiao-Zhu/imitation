import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { PageCycle } from './constants';
import ScriptVisitor from './scriptVisitor';

export default function scriptIterator(script: string, name: string) {
  const visitor = new ScriptVisitor(name);

  const vast = parse(script, {
    sourceType: 'module',
  });

  // 收集 import 依赖
  vast.program.body.forEach((i) => {
    if (t.isImportDeclaration(i)) {
      visitor.topModuleDeclarationsAndExpressionsHandler(i);
    }
  });

  // 收集 data
  traverse(vast, {
    ObjectProperty(path: NodePath<t.ObjectProperty>) {
      const parent = path.parentPath.parent;
      const name = (path.node.key as t.Identifier).name;
      if (t.isCallExpression(parent) && (parent.callee as t.Identifier).name === 'Page') {
        // 顶级的 ObjectProperty；比如 data/properties 等
        switch (name) {
          case 'data':
            const node = path.node.value;
            if (t.isObjectExpression(node)) {
              visitor.dataHandler(node.properties);
            }
            break;
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

  // 收集 生命周期，方法
  traverse(vast, {
    ObjectMethod(path: NodePath<t.ObjectMethod>) {
      // 四个父亲
      // 1.page 里的对象ObjectExpression
      // 2.page调用 CallExpression
      // 3.page所在表达式 ExpressionStatement
      // 4.program
      const isTopLevelMethod = Boolean(t.isProgram(path.parentPath.parentPath?.parentPath?.parent));
      const parent = path.parentPath.parent;
      const name = (path.node.key as t.Identifier).name;
      if (isTopLevelMethod && t.isCallExpression(parent)) {
        const pageCycleKeys = Object.keys(PageCycle);
        if (pageCycleKeys.includes(name)) {
          // 生命周期
          visitor.pageCycleMethodHandler(path);
        } else {
          // 实例方法
          visitor.objectMethodHandler(path);
        }
      }
    },
  });
}

import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

// Page 中的 this.data 要改成 this.state，this.setData 要改成 this.setState
export default function formatThisExpression(path: NodePath<t.ObjectMethod>): t.BlockStatement {
  const blocks: t.Statement[] = [];
  path.traverse({
    enter(subPath: any) {
      subPath.traverse({
        ThisExpression(thisPath) {
          const thisPropertyName = ((thisPath.parent as t.MemberExpression)?.property as t.Identifier).name;
          if (thisPropertyName === 'data') {
            ((thisPath.parent as t.MemberExpression)?.property as t.Identifier).name = 'state';
          }
          if (thisPropertyName === 'setData') {
            ((thisPath.parent as t.MemberExpression)?.property as t.Identifier).name = 'setState';
          }
        },
      });
      // ObjectMethod -> BlockStatement -> ExpressionStatement
      if (subPath.parentPath.parent === path.node && t.isStatement(subPath.node)) {
        blocks.push(subPath?.node);
      }
    },
  });

  // 创建一个 BlockStatement，所以只需要 push ExpressionStatement
  return t.blockStatement(blocks);
}

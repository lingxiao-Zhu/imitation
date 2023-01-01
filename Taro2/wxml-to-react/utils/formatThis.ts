import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

// Page 中的 this.data 要改成 this.state，this.setData 要改成 this.setState
export default function formatThisExpression(path: NodePath<t.ObjectMethod>): t.BlockStatement {
  const block: t.Statement[] = [];
  path.traverse({
    ThisExpression(subPath) {
      const thisPropertyName = ((subPath.parent as t.MemberExpression)?.property as t.Identifier).name;
      if (thisPropertyName === 'data') {
        ((subPath.parent as t.MemberExpression)?.property as t.Identifier).name = 'state';
      }
      if (thisPropertyName === 'setData') {
        ((subPath.parent as t.MemberExpression)?.property as t.Identifier).name = 'setState';
      }
      // if (t.isStatement(subPath.parentPath.parent)) {
      //   block.push(subPath.parentPath.parent);
      // }
    },
  });
  return t.blockStatement(block);
}

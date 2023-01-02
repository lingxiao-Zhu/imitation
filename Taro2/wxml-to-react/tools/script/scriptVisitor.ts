import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { PageCycle } from './constants';
import { Script } from './types';
import formatThisExpression from './utils/formatThis';

export default class ScriptVisitor {
  script: Script;

  constructor(name: string) {
    this.script = {
      topStatement: [],
      name: name,
      data: {},
      methods: new Map(),
    };
  }

  dataHandler(body: t.Node[]) {
    this.script.data._statements = [...body];
    const propNodes = body as t.ObjectProperty[];
    propNodes.forEach((propNode) => {
      this.script.data[(propNode.key as t.Identifier).name] = propNode;
    });
  }

  topModuleDeclarationsAndExpressionsHandler(path: t.ImportDeclaration) {
    this.script.topStatement.push(path);
  }

  pageCycleMethodHandler(path: NodePath<t.ObjectMethod>) {
    const wxmlCycleName = (path.node.key as t.Identifier).name;
    const reactCycleName = PageCycle[wxmlCycleName];
    if (reactCycleName) {
      this._addMethod(path, reactCycleName);
    }
  }

  objectMethodHandler(path: NodePath<t.ObjectMethod>) {
    this._addMethod(path);
  }

  _addMethod(path: NodePath<t.ObjectMethod>, name = '') {
    const params = path.node.params;
    const realName = name || (path.node.key as t.Identifier).name;
    // 函数内 this 需要处理下（this.data/this.properties）
    const blockStatement = formatThisExpression(path);
    this.script.methods.set(name, t.classMethod('method', t.identifier(realName), params, blockStatement));
  }
}

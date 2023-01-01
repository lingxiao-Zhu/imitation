import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { Script } from './types';

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
      console.log(propNode);
      this.script.data[(propNode.key as t.Identifier).name] = propNode;
    });
  }

  componentCycleMethodHandler(path: NodePath<t.ObjectMethod>) {}
}

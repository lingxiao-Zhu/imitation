import * as t from '@babel/types';

export interface ICode {
  scriptCode: string;
  templateCode: string;
}

export interface ITransformParams {
  baseDir: string;
  componentName: string;
}

export interface ScriptProps {
  type: string;
  typeValue: string | string[];
  defaultValue: any;
  required: boolean;
  validator: boolean;
  observer: boolean;
}

export interface ScriptObserver {
  name: string;
  newValNode: t.Identifier | undefined;
  oldValNode: t.Identifier | undefined;
  bodyExpression: t.Statement[];
}

export interface Script {
  // 简单实现这些属性就行
  // component: boolean;
  name: string;
  data: Record<string, any>;
  // props: Map<string, ScriptProps>;
  methods: Map<string, t.ClassMethod>;
  // computed: Map<string, t.ClassMethod>;
  topStatement: (t.ModuleDeclaration | t.Statement)[];
  // customObjectProperty: t.ClassProperty[]; //
  // observer: ScriptObserver[];
}

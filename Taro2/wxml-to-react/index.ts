import fs from 'fs';
import path from 'path';
import generate from '@babel/generator';

import scriptIterator from './tools/script/scriptIterator';
import templateIterator from './tools/template/templateIterator';

import { ICode, ITransformParams } from './types';

function getCode(codePath: string) {
  return fs.readFileSync(codePath, 'utf8');
}

function readCode(params: ITransformParams): ICode {
  const { baseDir, componentName } = params;
  const scriptPath = path.resolve(baseDir, `${componentName}.js`);
  const templatePath = path.resolve(baseDir, `${componentName}.wxml`);
  // 暂时先不实现下面两个
  // const configPath = path.resolve(baseDir, `index.json`);
  // const cssPath = path.resolve(baseDir, `index.wxss`);

  return {
    scriptCode: getCode(scriptPath),
    templateCode: getCode(templatePath),
  };
}

function transformCode(code: ICode, params: ITransformParams) {
  // collect-data
  const script = scriptIterator(code.scriptCode, params.componentName);
  const template = templateIterator(code.templateCode);

  // react-template
  const rast = reactTemplateBuilder({
    script,
    template,
  });

  // collect-data + react-template => react-ast
  const targetAst = reactIterator(rast, app, options);
  const targetCode = generate(targetAst).code;

  return {
    code: targetCode,
  };
}

function transform(params: ITransformParams) {
  return transformCode(readCode(params), params);
}

transform({
  baseDir: path.resolve(__filename, '../', 'source'),
  componentName: 'demo',
});

import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';

import scriptIterator from './iterators/scriptIterator';
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
  const script = scriptIterator(code.scriptCode, params.componentName);
  // const template = templateIterator(code.templateCode);
}

function transform(params: ITransformParams) {
  const code = transformCode(readCode(params), params);
}

transform({
  baseDir: path.resolve(__filename, '../..', 'source'),
  componentName: 'demo',
});

import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export default function scriptIterator(script: string, name: string) {
  const vast = parse(script, {
    sourceType: 'module',
  });

  traverse(vast, {
    CallExpression(path) {
      console.log(path);
    },
  });
}

import { parse } from '@byted-lynx/parser-ttml';
import jsxElementGenerator from './jsxElementGenerator';
// import  from './utils/logUtil';
import { Template } from '../../types';

export default function templateIterator(template: string): Template {
  const { root, errors } = parse(template);

  if (errors.length > 0) {
    errors.forEach((error) => {
      console.error(`compiler error: ${error.name} ${error.message}`, 'error');
    });
  }

  return jsxElementGenerator(root, undefined, new Set(), new Set(), new Map(), new Map(), new Set());
}

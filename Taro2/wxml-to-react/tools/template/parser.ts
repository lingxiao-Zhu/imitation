import { BaseNode, ElementNode, TextNode } from './nodes';
import Tokenizer from './tokenizer';

type RootNode = {
  childNodes: BaseNode[];
};

export default class Parser {
  scanner: Tokenizer;
  root: RootNode;
  parent: RootNode | ElementNode;
  node?: BaseNode;

  constructor(code: string) {
    this.scanner = new Tokenizer(code);
    this.root = {
      childNodes: [],
    };
    this.parent = this.root;
  }

  static parse(code: string) {
    const parser = new Parser(code);
    parser.scanner.scan();
    // parser.parse();
    // return {
    //   root: parser.root,
    //   errors: parser.errors,
    // };
  }
}

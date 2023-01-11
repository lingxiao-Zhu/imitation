import Tokenizer from './tokenizer';
export default class Parser {
  scanner: Tokenizer;

  constructor(code: string) {
    this.scanner = new Tokenizer(code);
    this.root = {
      childNodes: [],
    };
  }

  static parse(code: string) {
    const parser = new Parser(code);
    let chat = parser.scanner.scan();
    // parser.parse();
    // return {
    //   root: parser.root,
    //   errors: parser.errors,
    // };
  }
}

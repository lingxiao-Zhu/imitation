import { CodePointer } from './pointer';

export default class Lexer {
  pointer: CodePointer;
  constructor(source: string) {
    this.pointer = new CodePointer(source);
  }

  scan(text: string) {}
}

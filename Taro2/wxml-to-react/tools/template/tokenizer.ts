import { STATES, CHAR, ACTIONS, CHAR_TO_ACTIONS, TOKEN_TYPES } from './utils';

interface Traverse {
  (type: TOKEN_TYPES.TEXT, value: string): void;
  (type: TOKEN_TYPES.TAG_OPEN, value: string, selfClosing: boolean): void;
  (type: TOKEN_TYPES.TAG_CLOSE, closing: boolean): void;
  (type: TOKEN_TYPES.ATTRIBUTE_NAME, value: string): void;
  (type: TOKEN_TYPES.ATTRIBUTE_VALUE, value: string): void;
}

export default class Tokenizer {
  source: string;
  point: number; // 字符串指针
  state: STATES;
  text: string;
  quote: string; // 起始 `"`
  closing: boolean;
  traverse: Traverse;

  constructor(source: string, traverse: Traverse) {
    this.traverse = traverse;
    this.source = source;
    this.point = 0;
    this.state = STATES.TEXT;
    this.text = '';
    this.quote = '';
    this.closing = false;
  }

  get stateMachine() {
    const { point, source } = this;
    const curChar = source[point];

    // 清空 text，表明完成一词法分析，要告诉parser，以便于完成语法分析。
    return {
      [STATES.TEXT]: {
        [ACTIONS.LT]: () => {
          this.text = '';
          this.state = STATES.TAG_OPEN;
        },
        [ACTIONS.CHAR]: () => {
          this.text += curChar;
          if (point === source.length - 1) {
            // the end
            this.traverse(TOKEN_TYPES.TEXT, curChar);
          }
        },
      },
      [STATES.TAG_OPEN]: {
        [ACTIONS.CHAR]: () => {
          this.state = STATES.TAG_NAME;
          this.text += curChar;
        },
        [ACTIONS.SLASH]: () => {
          this.closing = true;
          this.state = STATES.TAG_NAME;
        },
      },
      [STATES.TAG_NAME]: {
        [ACTIONS.CHAR]: () => {
          this.text += curChar;
        },
        [ACTIONS.SPACE]: () => {
          this.state = STATES.ATTRIBUTE_NAME;
          this.text = '';
        },
        [ACTIONS.GT]: () => {
          this.traverse(TOKEN_TYPES.TAG_CLOSE, this.closing);
          this.state = STATES.TEXT;
          this.text = '';
          this.closing = false;
        },
      },
      [STATES.ATTRIBUTE_NAME]: {
        [ACTIONS.CHAR]: () => {
          this.text += curChar;
        },
        [ACTIONS.EQUAL]: () => {
          this.state = STATES.ATTRIBUTE_VALUE;
          this.text = '';
        },
      },
      [STATES.ATTRIBUTE_VALUE]: {
        [ACTIONS.CHAR]: () => {
          this.text += curChar;
        },
        [ACTIONS.QUOTE]: () => {
          if (!this.quote) {
            this.quote = curChar;
            return;
          }
          if (curChar === this.quote) {
            this.quote = '';
            this.text = '';
            this.state = STATES.ATTRIBUTE_NAME; // <div a="1" b="1"></div>, next is b
            return;
          }
        },
        [ACTIONS.GT]: () => {
          this.traverse(TOKEN_TYPES.TAG_CLOSE, this.closing);
          this.text = '';
          this.state = STATES.TEXT;
          this.closing = false;
        },
      },
    };
  }

  scan() {
    const char = this.source[this.point] as CHAR;
    const action = CHAR_TO_ACTIONS[char] || ACTIONS.CHAR;
    this.stateMachine[this.state][action]();
  }
}

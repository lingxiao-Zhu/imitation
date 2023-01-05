import { TokenType, CHAR, ACTIONS, CHAR_TO_ACTIONS } from './utils';

export default class Tokenizer {
  source: string;
  point: number; // 字符串指针
  tokenType: TokenType;
  text: string;

  constructor(source: string) {
    this.source = source;
    this.point = 0;
    this.tokenType = TokenType.TEXT;
    this.text = '';
  }

  get stateMachine() {
    return {
      [TokenType.TEXT]: {
        [ACTIONS.LT]: () => {
          this.tokenType = TokenType.TAG_OPEN;
        },
      },
      [TokenType.TAG_OPEN]: {
        [ACTIONS.CHAR]: () => {
          this.text += this.source[this.point];
        },
      },
    };
  }

  scan(text: string) {
    const char = text[this.point];
    const action = CHAR_TO_ACTIONS[char] || ACTIONS.CHAR;
    this.stateMachine[this.tokenType][action]();
  }
}

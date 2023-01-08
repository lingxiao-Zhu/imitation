import { STATES, CHAR, ACTIONS, CHAR_TO_ACTIONS, TOKEN_TYPES } from './utils';

export default class Tokenizer {
  source: string;
  point: number; // 字符串指针
  state: STATES;
  text: string;

  constructor(source: string) {
    this.source = source;
    this.point = 0;
    this.state = STATES.TEXT;
    this.text = '';
  }

  get stateMachine() {
    const { point, source } = this;
    const curChar = source[point];
    const nextChar = source[point + 1];

    return {
      [STATES.TEXT]: {
        [ACTIONS.LT]: () => {
          this.state = STATES.TAG_OPEN;
        },
      },
      [STATES.TAG_OPEN]: {
        [ACTIONS.CHAR]: () => {
          this.state = STATES.TAG_NAME;
          this.text += curChar;
        },
      },
      [STATES.TAG_NAME]: {
        [ACTIONS.CHAR]: () => {
          this.text += curChar;
        },
        [ACTIONS.SPACE]: () => {
          this.finish(STATES.ATTRIBUTE_NAME);
        },
      },
    };
  }

  finish(nextState: STATES) {
    // end cur state, tell parser
    this.text = '';
    this.state = nextState;
  }

  scan(text: string) {
    const char = text[this.point] as CHAR;
    const action = CHAR_TO_ACTIONS[char] || ACTIONS.CHAR;
    return this.stateMachine[this.state][action]();
  }
}

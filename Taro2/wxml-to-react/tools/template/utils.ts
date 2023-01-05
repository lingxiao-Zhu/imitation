export enum TokenType {
  TEXT,
  TAG_OPEN,
  TAG_CLOSE,
  ATTRIBUTE_NAME,
  ATTRIBUTE_VALUE,

  // start of mustache
  MUSTACHE_OPEN,
  MUSTACHE_CLOSE,
  // end of mustache
}

export enum CHAR {
  LT = '<',
  GT = '>',
  EXCLAMATION = '!',
  SLASH = '/',
  MINUS = '-',
  SPACE = ' ',
  TABLE = '\t',
  EQUAL = '=',
  QUESTION = '?',
  SINGLE_QUOTE = "'",
  DOUBLE_QUOTE = '"',
  LINE_FEED = '\n',
  CARRIAGE_RETURN = '\r',
  // start of mustache
  BRACE_LEFT = '{',
  BRACE_RIGHT = '}',
  // end of mustache
}
export enum ACTIONS {
  SPACE,
  LT,
  GT,
  QUOTE,
  EQUAL,
  SLASH,
  EXCLAMATION,
  QUESTION,
  CHAR,
  MINUS,
  BACK_SLASH,
  // start of mustache
  BRACE_LEFT,
  BRACE_RIGHT,
  // end of mustache
}

export const CHAR_TO_ACTIONS = {
  [CHAR.SPACE]: ACTIONS.SPACE,
  [CHAR.TABLE]: ACTIONS.SPACE,
  [CHAR.LINE_FEED]: ACTIONS.SPACE,
  [CHAR.CARRIAGE_RETURN]: ACTIONS.SPACE,
  [CHAR.LT]: ACTIONS.LT,
  [CHAR.GT]: ACTIONS.GT,
  [CHAR.DOUBLE_QUOTE]: ACTIONS.QUOTE,
  [CHAR.SINGLE_QUOTE]: ACTIONS.QUOTE,
  [CHAR.EQUAL]: ACTIONS.EQUAL,
  [CHAR.SLASH]: ACTIONS.SLASH,
  [CHAR.EXCLAMATION]: ACTIONS.EXCLAMATION,
  [CHAR.QUESTION]: ACTIONS.QUESTION,
  [CHAR.MINUS]: ACTIONS.MINUS,
  // start of mustache
  [CHAR.BRACE_LEFT]: ACTIONS.BRACE_LEFT,
  [CHAR.BRACE_RIGHT]: ACTIONS.BRACE_RIGHT,
  // end of mustache
};

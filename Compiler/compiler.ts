type Token = {
  type: 'paren' | 'number' | 'string' | 'name';
  value: string;
};

const WHITESPACE = /\s/;
const NUMBERS = /[0-9]/;
const LETTERS = /[a-z]/i;

/**
 *        LISP          JavaScript
 * 2+2    (add 2 2)     add(2, 2)
 *
 */

/**
 * ============================================================================
 *                                   (/^▽^)/
 *                                THE TOKENIZER!
 * ============================================================================
 */

/**
 * 词法分析
 * @param {string} input
 * @example (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
 *
 */
function tokenizer(input) {
  let current = 0;

  const tokens: Token[] = [];

  while (current < input.length) {
    let char = input[current];

    if (char === '(' || char === ')') {
      tokens.push({
        type: 'paren',
        value: char,
      });
      current++;
      continue;
    }

    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    if (NUMBERS.test(char)) {
      let value = '';

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: 'number',
        value,
      });
      continue;
    }

    if (char === '"') {
      let value = '';
      // We'll skip the opening double quote in our token.
      char = input[++current];

      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      // Skip the closing double quote.
      char = input[++current];

      tokens.push({
        type: 'string',
        value,
      });

      continue;
    }

    if (LETTERS.test(char)) {
      let value = '';

      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: 'name',
        value,
      });
      continue;
    }

    throw new Error("I don't know what this character is: " + char);
  }

  return tokens;
}

console.log(tokenizer('(add 2 2)'));
/**
 * [
 *  { type: 'paren', value: '(' },
 *  { type: 'name', value: 'add' },
 *  { type: 'number', value: '2' },
 *  { type: 'number', value: '2' },
 *  { type: 'paren', value: ')' }
 * ]
 */

/**
 * ============================================================================
 *                                 ヽ/❀o ل͜ o\ﾉ
 *                                THE PARSER!!!
 * ============================================================================
 */

/**
 *
 * @param tokens
 * @example [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */
function parser(tokens: Array<Token>) {
  let current = 0;

  function walk() {
    const { type, value } = tokens[current];

    if (type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value,
      };
    }

    if (type === 'string') {
      current++;
      return {
        type: 'StringLiteral',
        value,
      };
    }

    /**
     * [
     *  { type: 'paren', value: '(' },
     *  { type: 'name', value: 'add' },
     *  { type: 'number', value: '2' },
     *  { type: 'number', value: '2' },
     *  { type: 'paren', value: ')' }
     * ]
     */
    if (type === 'paren' && value === '(') {
      // 这里current+1，可以获取到函数名称
      let nextToken = tokens[++current];

      let node = {
        type: 'CallExpression',
        name: nextToken.value,
        params: [],
      };

      // 跳过name token，开始获取函数参数
      nextToken = tokens[++current];
      while (nextToken.type !== 'paren' || (nextToken.type === 'paren' && nextToken.value !== ')')) {
        node.params.push(walk());
        nextToken = tokens[current];
      }

      current++;

      return node;
    }

    throw new TypeError(type);
  }

  // Now, we're going to create our AST which will have a root which is a
  // `Program` node.
  let ast = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}

console.log(JSON.stringify(parser(tokenizer('(add 2 2)'))));
/**
 * 
 * {
 * type: 'Program',
 * body: [
    {
      type: 'CallExpression',
      name: 'add',
      params: [
        { type: 'NumberLiteral', value: '2' },
        { type: 'NumberLiteral', value: '2' },
      ],
    },
  ],
  };
 */

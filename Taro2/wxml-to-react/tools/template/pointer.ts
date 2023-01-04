import { charCode } from '../../constants';

/** 换行符 */
export function isNewline(char: number) {
  return char === charCode.NWL || char === charCode.CAR || char === charCode.LFD;
}

/** 空白字符 */
export function isWhiteSpace(char: number) {
  return isNewline(char) || char === charCode.WSP || char === charCode.WSP2 || char === charCode.TAB;
}

/** 字符串指针类 */
export class CodePointer {
  private readonly _source: string;
  private readonly _length: number;
  private _offset: number;

  constructor(source: string) {
    this._source = source;
    this._length = source.length;
    this._offset = 0;
  }

  get eos() {
    return this._length <= this._offset;
  }

  get source() {
    return this._source;
  }

  get pos() {
    return this._offset;
  }

  goBackTo(pos: number) {
    this._offset = pos;
  }

  goBack(n: number) {
    this._offset -= n;
  }

  advance(n: number) {
    this._offset += n;
  }

  goToEnd() {
    this._offset = this.source.length;
  }

  nextChar() {
    return this.source.charCodeAt(this._offset++) || 0;
  }

  peekChar(n = 0) {
    return this.source.charCodeAt(this._offset + n) || 0;
  }

  peekChars(n = 0) {
    const chars: number[] = [];

    for (let i = 0; i < n; i++) {
      chars.push(this._offset + i);
    }

    return chars;
  }

  peekSame(chars: number[]) {
    const len = chars.length;

    for (let i = 0; i < len; i++) {
      if (chars[i] !== this.source.charCodeAt(this._offset + i)) {
        return false;
      }
    }

    return true;
  }

  advanceIfChar(ch: number) {
    if (ch === this.source.charCodeAt(this._offset)) {
      this._offset++;
      return true;
    }

    return false;
  }

  advanceIfCharOr(chars: number[]) {
    if (chars.includes(this.source.charCodeAt(this._offset))) {
      this._offset++;
      return true;
    }

    return false;
  }

  advanceIfChars(ch: number[]) {
    let i: number;

    if (this._offset + ch.length > this.source.length) {
      return false;
    }

    for (i = 0; i < ch.length; i++) {
      if (this.source.charCodeAt(this._offset + i) !== ch[i]) {
        return false;
      }
    }

    this.advance(i);

    return true;
  }

  advanceIfCbTrue(cb: (ch: number) => boolean) {
    let i = 0;

    while (cb(this.source.charCodeAt(this._offset + i)) && this._offset + i <= this.source.length) {
      i++;
    }

    this.advance(i);
    return i > 0;
  }

  advanceIfRegExp(regex: RegExp) {
    const str = this.source.substr(this._offset);
    const match = regex.exec(str);

    if (match) {
      this._offset = this._offset + match.index + match[0].length;
      return match[0];
    }

    return '';
  }

  advanceUntilChar(ch: number) {
    while (this._offset < this.source.length) {
      if (this.source.charCodeAt(this._offset) === ch) {
        return true;
      }

      this.advance(1);
    }

    return false;
  }

  advanceUntilChars(ch: number[]) {
    while (this._offset + ch.length <= this.source.length) {
      let i = 0;

      for (; i < ch.length && this.source.charCodeAt(this._offset + i) === ch[i]; i++) {}

      if (i === ch.length) {
        return true;
      }

      this.advance(1);
    }

    this.goToEnd();

    return false;
  }

  advanceUntilCharOr(ch: number[]) {
    while (this._offset < this.source.length) {
      const char = this.source.charCodeAt(this._offset);

      for (let j = 0; j < ch.length; j++) {
        if (char === ch[j]) {
          return true;
        }
      }

      this.advance(1);
    }

    this.goToEnd();
    return false;
  }

  advanceUntilRegExp(regex: RegExp) {
    const str = this.source.substr(this._offset);
    const match = regex.exec(str);

    if (match) {
      this._offset = this._offset + match.index;
      return match[0];
    } else {
      this.goToEnd();
    }

    return '';
  }

  advanceUntilRegExpWithSlash(regex: RegExp) {
    const newRegex = new RegExp(`\\\\|${regex.source}`);

    let match = newRegex.exec(this.source.substr(this._offset));

    while (match && match[0] === '\\') {
      this._offset += match.index + 2;
      match = newRegex.exec(this.source.substr(this._offset));
    }

    if (match) {
      this._offset += match.index;
      return match[0];
    } else {
      this.goToEnd();
      return '';
    }
  }

  skipWhitespace() {
    return this.advanceWhileChar(isWhiteSpace) > 0;
  }

  advanceWhileChar(condition: (ch: number) => boolean) {
    const posNow = this._offset;

    while (this._offset < this._length && condition(this.source.charCodeAt(this._offset))) {
      this._offset++;
    }

    return this._offset - posNow;
  }
}

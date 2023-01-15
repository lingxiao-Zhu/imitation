export enum NODE_TYPES {
  ELEMENT = 1,
  TEXT = 3,
}

export abstract class BaseNode {
  public type: NODE_TYPES;
  public parentNode: BaseNode | null;

  constructor(type: NODE_TYPES) {
    this.type = type;
    this.parentNode = null;
  }

  abstract toJSON(): Object;
}

export class ElementNode extends BaseNode {
  public tagName: string;
  public attributes: {
    [attrName: string]: string | true;
  };
  public childNodes: Array<ElementNode | TextNode>;
  public selfClosing: boolean;

  constructor() {
    super(NODE_TYPES.ELEMENT);
    this.tagName = '';
    this.attributes = {};
    this.childNodes = [];
    this.selfClosing = false;
  }

  toJSON(): Object {
    return {
      type: this.type,
      tagName: this.tagName,
      attributes: this.attributes,
      selfClosing: this.selfClosing,
      childNodes: this.childNodes.map(function (node) {
        return node.toJSON();
      }),
    };
  }
}

export class TextNode extends BaseNode {
  public textContent: string;

  constructor(text: string) {
    super(NODE_TYPES.TEXT);
    this.textContent = text;
  }

  toJSON() {
    return {
      type: this.type,
      textContent: this.textContent,
    };
  }
}

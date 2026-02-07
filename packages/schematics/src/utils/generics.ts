/**
 * Generic Type Tree Parser
 * Translated from @abp/ng.schematics v3.2.0
 *
 * Parses .NET generic type strings (e.g. 'List<Dictionary<string, User>>')
 * into a tree structure for type adaptation.
 */

export type MapperFn = (node: TypeNode) => string;

/**
 * A node in the generic type tree.
 * Represents a type and its generic type arguments as children.
 */
export class TypeNode {
  children: TypeNode[] = [];
  index = 0;

  constructor(
    public data: string,
    public parent: TypeNode | null,
    public mapperFn: MapperFn = (node) => node.data
  ) {}

  /**
   * Converts the tree to an array of generic type strings.
   * Returns each node with its generic arguments as `<T0, T1>` placeholders.
   *
   * @example For `List<User>`: ['List<T0>', 'User']
   */
  toGenerics(): string[] {
    const generics = this.children.length
      ? `<${this.children.map((n) => `T${n.index}`).join(', ')}>`
      : '';

    return [this.data + generics].concat(
      this.children.reduce<string[]>((acc, node) => acc.concat(node.toGenerics()), [])
    );
  }

  /**
   * Converts the tree to a TypeScript type string.
   * Uses the mapper function to transform each node's data.
   *
   * @example For `List<User>` with simplifier: 'User[]'
   */
  toString(): string {
    const self = this.mapperFn(this);
    if (!self) return '';

    const representation = self + this.children.filter(String || Boolean).join(', ');

    if (!this.parent) return representation;

    const siblings = this.parent.children;
    return (
      (siblings[0] === this ? '<' : '') +
      representation +
      (siblings[siblings.length - 1] === this ? '>' : '')
    );
  }

  valueOf(): string {
    return this.toString();
  }
}

/**
 * Parses a .NET generic type string into a TypeNode tree.
 *
 * @param type - The type string, e.g. 'List<Dictionary<string, User>>'
 * @param mapperFn - Optional function to transform each node's data during toString()
 * @returns The root TypeNode
 */
export function parseGenerics(type: string, mapperFn?: MapperFn): TypeNode {
  const [rootType, ...types] = type.split('<');
  const root = new TypeNode(rootType, null, mapperFn);

  types.reduce((parent: TypeNode, t: string) => {
    const [left, right] = t.split(/>+,?\s*/);

    const leftNode = new TypeNode(left, parent, mapperFn);
    leftNode.index = parent.children.length;
    parent.children.push(leftNode);
    parent = leftNode;

    const matches = t.match(/>/g);
    let length = matches ? matches.length : 0;
    while (length--) parent = parent.parent!;

    if (right) {
      parent = parent.parent!;
      const rightNode = new TypeNode(right, parent, mapperFn);
      rightNode.index = parent.children.length;
      parent.children.push(rightNode);
      parent = rightNode;
    }

    return parent;
  }, root);

  return root;
}

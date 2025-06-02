// --------------
export type NodeType =
  | "Program"
  | "Numeric Literal"
  | "Identifier"
  | "Null Literal"
  | "Binary Expression";

export interface Statement {
  kind: NodeType;
}

export interface Program extends Statement {
  kind: "Program";
  body: Statement[];
}

export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
  kind: "Binary Expression";
  left: Expression;
  right: Expression;
  operator: string;
}

export interface Identifier extends Expression {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expression {
  kind: "Numeric Literal";
  value: number;
}

export interface NullLiteral extends Expression {
  kind: "Null Literal";
  value: "null";
}
// ------------

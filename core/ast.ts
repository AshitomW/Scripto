// --------------
export type NodeType =
  // Statements
  | "Program"
  | "VariableDeclaration"
  | "AssignmentExpression"

  // Expressions
  | "Numeric Literal"
  | "Identifier"
  | "Binary Expression";

export interface Statement {
  kind: NodeType;
}

export interface Program extends Statement {
  kind: "Program";
  body: Statement[];
}

export interface VariableDeclaration extends Statement {
  kind: "VariableDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expression;
}

export interface AssignmentExpression extends Statement {
  kind: "AssignmentExpression";
  assignee: Expression;
  value: Expression;
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

// ------------

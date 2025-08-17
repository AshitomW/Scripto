// --------------
export type NodeType =
  // Statements
  | "Program"
  | "VariableDeclaration"
  | "AssignmentExpression"
  | "Property"
  | "ObjectLiteral"
  // Expressions
  | "MemberExpression"
  | "CallExpression"
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

export interface Property extends Expression {
  kind: "Property";
  key: string;
  value?: Expression; // Optional For Shorthand Syntax {key}
}

export interface ObjectLiteral extends Expression {
  kind: "ObjectLiteral";
  properties: Property[];
}

export interface CallExpression extends Expression {
  kind: "CallExpression";
  arguments: Expression[];
  caller: Expression;
}

export interface MemberExpression extends Expression {
  kind: "MemberExpression";
  object: Expression;
  property: Expression;
  computed: boolean; // for abc[computation];
}

// ------------

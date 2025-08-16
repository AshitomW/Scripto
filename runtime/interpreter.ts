import {
  ValueType,
  RuntimeValue,
  NumberValue,
  NullValue,
  M_NULL,
  M_NUMBER,
} from "./values";
import {
  BinaryExpression,
  Identifier,
  NodeType,
  NumericLiteral,
  Program,
  Statement,
} from "../core/ast";
import Environment from "./environment";

function interpret_program(program: Program, env: Environment): RuntimeValue {
  let lastEvaluated: RuntimeValue = M_NULL();

  for (const statement of program.body) {
    lastEvaluated = interpret(statement, env);
  }

  return lastEvaluated;
}

function interpret_binary_expression(
  binExp: BinaryExpression,
  env: Environment,
): RuntimeValue {
  const lh = interpret(binExp.left, env);
  const rh = interpret(binExp.right, env);

  const validExpression = lh.type == "number" && rh.type == "number";
  if (validExpression) {
    return interpret_numeric_binary_expression(
      lh as NumberValue,
      rh as NumberValue,
      binExp.operator,
    );
  }
  return M_NULL() as NullValue;
}

function interpret_numeric_binary_expression(
  lh: NumberValue,
  rh: NumberValue,
  operator: string,
): NumberValue {
  let accumulator = 0;
  switch (operator) {
    case "+":
      accumulator = lh.value + rh.value;
      break;
    case "-":
      accumulator = lh.value - rh.value;
      break;
    case "*":
      accumulator = lh.value * rh.value;
      break;
    case "/":
      accumulator = lh.value / rh.value;
      break;
    case "%":
      accumulator = lh.value % rh.value;
      break;
    case "^":
      accumulator = lh.value;
      for (let i = 1; i < rh.value; i++) {
        accumulator *= lh.value;
      }
      break;
    default:
      break;
  }
  return { value: accumulator, type: "number" };
}

export function interpret_identifier(
  idt: Identifier,
  env: Environment,
): RuntimeValue {
  const val = env.lookUpVariable(idt.symbol);
  return val;
}

export function interpret(ASTNode: Statement, env: Environment): RuntimeValue {
  switch (ASTNode.kind) {
    case "Numeric Literal":
      return M_NUMBER((ASTNode as NumericLiteral).value);
      break;
    case "Binary Expression":
      return interpret_binary_expression(ASTNode as BinaryExpression, env);
      break;
    case "Identifier":
      return interpret_identifier(ASTNode as Identifier, env);
    case "Program":
      return interpret_program(ASTNode as Program, env);
    default:
      console.log("This Ast Node Has Not Been Setup For Interpretation");
      process.exit();
  }
}

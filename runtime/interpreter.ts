import { ValueType, RuntimeValue, NumberValue, NullValue } from "./values";
import {
  BinaryExpression,
  NodeType,
  NumericLiteral,
  Program,
  Statement,
} from "../core/ast";

function interpret_program(program: Program): RuntimeValue {
  let lastEvaluated: RuntimeValue = {
    type: "null",
    value: "null",
  } as NullValue;

  for (const statement of program.body) {
    lastEvaluated = interpret(statement);
  }

  return lastEvaluated;
}

function interpret_binary_expression(binExp: BinaryExpression): RuntimeValue {
  const lh = interpret(binExp.left);
  const rh = interpret(binExp.right);

  const validExpression = lh.type == "number" && rh.type == "number";
  if (validExpression) {
    return interpret_numeric_binary_expression(
      lh as NumberValue,
      rh as NumberValue,
      binExp.operator,
    );
  }
  return { type: "null", value: "null" } as NullValue;
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
    default:
      break;
  }
  return { value: accumulator, type: "number" };
}

export function interpret(ASTNode: Statement): RuntimeValue {
  switch (ASTNode.kind) {
    case "Numeric Literal":
      return {
        value: (ASTNode as NumericLiteral).value,
        type: "number",
      } as NumberValue;
      break;
    case "Null Literal":
      return { value: "null", type: "null" } as NullValue;
      break;
    case "Binary Expression":
      return interpret_binary_expression(ASTNode as BinaryExpression);
      break;
    case "Program":
      return interpret_program(ASTNode as Program);
    default:
      console.log("This Ast Node Has Not Been Setup For Interpretation");
      process.exit();
  }
}

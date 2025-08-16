import { BinaryExpression } from "../../core/ast";
import Environment from "../environment";
import { interpret } from "../interpreter";
import { M_NULL, NullValue, NumberValue, RuntimeValue } from "../values";

export function interpret_binary_expression(
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

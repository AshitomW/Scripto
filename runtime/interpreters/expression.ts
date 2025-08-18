import {
  BinaryExpression,
  CallExpression,
  ObjectLiteral,
} from "../../core/ast";
import Environment from "../environment";
import { interpret } from "../interpreter";
import {
  FunctionValue,
  M_NULL,
  NativeFunctionValue,
  NullValue,
  NumberValue,
  ObjectValue,
  RuntimeValue,
} from "../values";

export function interpret_binary_expression(
  binExp: BinaryExpression,
  env: Environment
): RuntimeValue {
  const lh = interpret(binExp.left, env);
  const rh = interpret(binExp.right, env);

  const validExpression = lh.type == "number" && rh.type == "number";
  if (validExpression) {
    return interpret_numeric_binary_expression(
      lh as NumberValue,
      rh as NumberValue,
      binExp.operator
    );
  }
  return M_NULL() as NullValue;
}

function interpret_numeric_binary_expression(
  lh: NumberValue,
  rh: NumberValue,
  operator: string
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

export function interpret_object_expression(
  obj: ObjectLiteral,
  env: Environment
): RuntimeValue {
  const object = { type: "object", properties: new Map() } as ObjectValue;
  for (const { key, value } of obj.properties) {
    const runtimeValue =
      value == undefined ? env.lookUpVariable(key) : interpret(value, env);

    object.properties.set(key, runtimeValue);
  }

  return object;
}
export function interpret_call_expression(
  expr: CallExpression,
  env: Environment
): RuntimeValue {
  const args = expr.arguments.map((arg) => interpret(arg, env));
  const fn = interpret(expr.caller, env);

  if (fn.type == "NFunc") {
    const result = (fn as NativeFunctionValue).call(args, env);
    return M_NULL();
  } else if (fn.type == "Function") {
    const func = fn as FunctionValue;
    const scope = new Environment(func.declarationEnvironment);

    for (let i = 0; i < func.parameters.length; i++) {
      const variableName = func.parameters[i];
      scope.declareVariable(variableName, args[i], false);
    }

    let result: RuntimeValue = M_NULL();
    for (const stmt of func.body) {
      result = interpret(stmt, scope);
    }

    return result;
  }

  throw "Cannot Call something that's not a function." + JSON.stringify(fn);
}

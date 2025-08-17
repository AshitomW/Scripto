// Define the types that are used for runtime.
import { Runtime } from "inspector/promises";
import Environment from "./environment";

export type ValueType = "null" | "number" | "boolean" | "object" | "NFunc";

export interface RuntimeValue {
  type: ValueType;
}

export interface NullValue extends RuntimeValue {
  type: "null";
  value: null;
}

export interface NumberValue extends RuntimeValue {
  type: "number";
  value: number;
}
export interface BooleanValue extends RuntimeValue {
  type: "boolean";
  value: boolean;
}

export interface ObjectValue extends RuntimeValue {
  type: "object";
  properties: Map<string, RuntimeValue>;
}

export function M_NUMBER(n = 0) {
  return { type: "number", value: n } as NumberValue;
}

export function M_NULL() {
  return { type: "null", value: null } as NullValue;
}

export function M_BOOL(b = false) {
  return {
    type: "boolean",
    value: b,
  } as BooleanValue;
}

export type FunctionCall = (
  args: RuntimeValue[],
  env: Environment,
) => RuntimeValue;

export interface NativeFunctionValue extends RuntimeValue {
  type: "NFunc";
  call: FunctionCall;
}

export function M_NATIVE_FUNC(call: FunctionCall) {
  return { type: "NFunc", call } as NativeFunctionValue;
}

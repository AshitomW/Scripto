// Define the types that are used for runtime.
// At runtime , no way to know if null , object, boolean , etc.

export type ValueType = "null" | "number";

export interface RuntimeValue {
  type: ValueType;
}

export interface NullValue extends RuntimeValue {
  type: "null";
  value: "null";
}

export interface NumberValue extends RuntimeValue {
  type: "number";
  value: number;
}

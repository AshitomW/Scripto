import {
  AssignmentExpression,
  Identifier,
  VariableDeclaration,
} from "../../core/ast";
import Environment from "../environment";
import { interpret } from "../interpreter";
import { M_NULL, RuntimeValue } from "../values";

export function interpret_identifier(
  idt: Identifier,
  env: Environment,
): RuntimeValue {
  const val = env.lookUpVariable(idt.symbol);
  return val;
}

export function interpret_variable_declaration(
  declr: VariableDeclaration,
  env: Environment,
): RuntimeValue {
  const value = declr.value ? interpret(declr.value, env) : M_NULL();
  return env.declareVariable(declr.identifier, value, declr.constant);
}

export function interpret_assignment(
  node: AssignmentExpression,
  env: Environment,
): RuntimeValue {
  if (node.assignee.kind !== "Identifier")
    throw `Invalid LHS Assignment! ${JSON.stringify(node.assignee)}`;

  const varname = (node.assignee as Identifier).symbol;

  return env.assignVariable(varname, interpret(node.value, env));
}

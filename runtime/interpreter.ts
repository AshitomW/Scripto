import {
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Statement,
  VariableDeclaration,
} from "../core/ast";
import Environment from "./environment";
import {
  interpret_binary_expression,
  interpret_call_expression,
  interpret_object_expression,
} from "./interpreters/expression";
import {
  interpret_assignment,
  interpret_identifier,
  interpret_variable_declaration,
} from "./interpreters/variables";
import { M_NULL, M_NUMBER, RuntimeValue } from "./values";

function interpret_program(program: Program, env: Environment): RuntimeValue {
  let lastEvaluated: RuntimeValue = M_NULL();

  for (const statement of program.body) {
    lastEvaluated = interpret(statement, env);
  }

  return lastEvaluated;
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
      break;
    case "ObjectLiteral":
      return interpret_object_expression(ASTNode as ObjectLiteral, env);
      break;
    case "Program":
      return interpret_program(ASTNode as Program, env);
      break;
    case "VariableDeclaration":
      return interpret_variable_declaration(
        ASTNode as VariableDeclaration,
        env,
      );
      break;
    case "CallExpression":
      return interpret_call_expression(ASTNode as CallExpression, env);
    case "AssignmentExpression":
      return interpret_assignment(ASTNode as AssignmentExpression, env);
      break;
    default:
      console.log("This Ast Node Has Not Been Setup For Interpretation");
      process.exit();
  }
}

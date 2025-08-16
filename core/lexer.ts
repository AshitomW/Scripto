// Let x = 20

import { exit } from "process";
import * as fs from "fs";
import { isAlphabet, isNumeric, isOptional } from "./utils";
export enum TokenType {
  // Types?
  Number,
  Identifier,
  StringLiteral,
  // Operations?
  Equals,
  ParenOpen,
  ParenClose,
  BinaryOperator,
  // Keywords ??
  LET,
  EOF, // End Of File
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.LET,
};

export interface Token {
  value: string;
  type: TokenType;
}

function make_token(value = "", type: TokenType): Token {
  return { value, type };
}

export function Tokenize(source_code: string): Token[] {
  const tokens = new Array<Token>();
  const src = source_code.split("");

  while (src.length > 0) {
    // Build the tokens

    switch (src[0]) {
      case "(":
        tokens.push(make_token(src.shift(), TokenType.ParenOpen));
        break;
      case ")":
        tokens.push(make_token(src.shift(), TokenType.ParenClose));
        break;
      case "+":
      case "-":
      case "*":
      case "/":
      case "%":
      case "^":
        tokens.push(make_token(src.shift(), TokenType.BinaryOperator));
        break;
      case "=":
        tokens.push(make_token(src.shift(), TokenType.Equals));
        break;
      default:
        // Handle Multiple Characters Token , <= , -> , let

        if (isNumeric(src[0])) {
          let num = "";
          while (src.length > 0 && isNumeric(src[0])) {
            num += src.shift();
          }
          tokens.push(make_token(num, TokenType.Number));
        }

        // Identifier Token
        else if (isAlphabet(src[0])) {
          let identifier = "";
          while (src.length > 0 && isAlphabet(src[0])) {
            identifier += src.shift();
          }
          const isNotReserved = typeof KEYWORDS[identifier] !== "number";
          if (isNotReserved) {
            tokens.push(make_token(identifier, TokenType.Identifier));
          } else {
            tokens.push(make_token(identifier, KEYWORDS[identifier]));
          }
        } else if (isOptional(src[0])) {
          src.shift();
        } else {
          console.log("Character Not Recognizable : ", src[0]);
          exit(1);
        }
    }
  }

  tokens.push({ type: TokenType.EOF, value: "EOF" });
  return tokens;
}

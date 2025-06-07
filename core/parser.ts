import {
  Statement,
  Program,
  Expression,
  BinaryExpression,
  NumericLiteral,
  Identifier,
  NullLiteral,
} from "./ast";
import { Tokenize, Token, TokenType } from "./lexer";

/* Order of Precedence : PrimaryExpresion , Multiplications , Addition*/

export default class Parser {
  private tokens: Token[] = [];

  private notEOF(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private getCurrentToken() {
    return this.tokens[0] as Token;
  }

  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  public generateAST(source_code: string): Program {
    this.tokens = Tokenize(source_code);
    const program: Program = {
      kind: "Program",
      body: [],
    };
    while (this.notEOF()) {
      program.body.push(this.parse_statement());
    }
    return program;
  }

  private parse_statement(): Statement {
    return this.parse_expression();
  }

  private parse_expression(): Expression {
    return this.parse_additive_expression();
  }
  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.error("Parser Error", err, prev, "Expecting: ", type);
      process.exit(1);
    }
    return prev;
  }

  private parse_additive_expression(): Expression {
    // Left Precedance : 10+5-5
    let left = this.parse_multiplicative_expression();

    while (
      this.getCurrentToken().value == "+" ||
      this.getCurrentToken().value == "-"
    ) {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expression();
      left = {
        kind: "Binary Expression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parse_multiplicative_expression(): Expression {
    // Left Precedance : 10+5-5
    let left = this.parse_exponential_expression();

    while (
      this.getCurrentToken().value == "*" ||
      this.getCurrentToken().value == "/" ||
      this.getCurrentToken().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_exponential_expression();
      left = {
        kind: "Binary Expression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parse_exponential_expression(): Expression {
    let left = this.parse_primary_expression();
    while (this.getCurrentToken().value == "^") {
      const operator = this.eat().value;
      const right = this.parse_primary_expression();
      left = {
        kind: "Binary Expression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }
    return left;
  }

  private parse_primary_expression(): Expression {
    const currentToken = this.getCurrentToken().type;
    switch (currentToken) {
      case TokenType.Identifier:
        return {
          kind: "Identifier",
          symbol: this.eat().value,
        } as Identifier;
        break;
      case TokenType.Number:
        return {
          kind: "Numeric Literal",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;
        break;
      case TokenType.ParenOpen:
        this.eat(); // Remove the opening parenthesis;
        const value = this.parse_expression();
        this.expect(
          TokenType.ParenClose,
          "Unexpected Token Found Inside Parenthesised Expression. Expected Closing Parenthesis",
        ); // Remove the closing parenthesis;
        return value;
      case TokenType.NULL:
        this.eat(); // move ahead of the null keyword;
        return { kind: "Null Literal", value: "null" } as NullLiteral;
        break;
      default:
        console.error(
          "Unexpected Token Found During Parsing",
          this.getCurrentToken(),
        );
        process.exit(1);
    }
  }
}

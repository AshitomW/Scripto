import {
  Statement,
  Program,
  Expression,
  BinaryExpression,
  NumericLiteral,
  Identifier,
  VariableDeclaration,
  AssignmentExpression,
  Property,
  ObjectLiteral,
  CallExpression,
  MemberExpression,
} from "./ast";
import { Tokenize, Token, TokenType } from "./lexer";

/* Order of Precedence : PrimaryExpresion ,Member, Call, Exponent,  Multiplications , Addition*/

export default class Parser {
  private tokens: Token[] = [];

  private notEOF(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private currentToken() {
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
    switch (this.currentToken().type) {
      case TokenType.LET:
      case TokenType.CONST:
        return this.parse_variable_declaration();

      default:
        return this.parse_expression();
    }
  }

  private parse_variable_declaration(): Statement {
    // (const | let) identifier = expression;
    const isConstant = this.eat().type == TokenType.CONST;
    const identifier = this.expect(
      TokenType.Identifier,
      "Expecting Identifier Name Following Declaration Keywords",
    ).value;

    if (this.currentToken().type == TokenType.SEMICOLON) {
      this.eat();
      if (isConstant) {
        throw "Illegal Declaration; constants must be assigned a value";
      }

      return {
        kind: "VariableDeclaration",
        identifier,
        constant: false,
        value: undefined,
      } as VariableDeclaration;
    }

    this.expect(
      TokenType.Equals,
      "Expected Equals Token Following Identifier In Variable Declaration",
    );

    const declr = {
      kind: "VariableDeclaration",
      value: this.parse_expression(),
      identifier,
      constant: isConstant,
    } as VariableDeclaration;

    this.expect(
      TokenType.SEMICOLON,
      "Statements must be terminated with semicolons",
    );

    return declr;
  }

  private parse_expression(): Expression {
    return this.parse_assignment_expression();
  }

  private parse_object_expression(): Expression {
    // Struct: { Prop[] }

    if (this.currentToken().type !== TokenType.OpenBrace) {
      return this.parse_additive_expression();
    }

    this.eat(); // go past open brackets.
    const properties = new Array<Property>();
    while (this.notEOF() && this.currentToken().type !== TokenType.CloseBrace) {
      /*
          Cases: 
          1 : {key <- value, key <- value}
          2 : {key, key}
      */
      const key = this.expect(
        TokenType.Identifier,
        "Object Literal Key Expected",
      ).value;

      // {key,key}
      if (this.currentToken().type == TokenType.COMMA) {
        this.eat();
        properties.push({
          key,
          kind: "Property",
        } as Property);
        continue;
      } else if (this.currentToken().type == TokenType.CloseBrace) {
        properties.push({
          key,
          kind: "Property",
        } as Property);
        continue;
      }

      // ---- BP
      this.expect(
        TokenType.PROPASSIGN,
        "Missing <- following identifier in Object Expression",
      );
      // -----
      const value = this.parse_expression();
      properties.push({ kind: "Property", value, key });

      if (this.currentToken().type != TokenType.CloseBrace) {
        this.expect(
          TokenType.COMMA,
          "Expected Comma Or Closing Bracket Following A Property",
        );
      }
    }
    this.expect(
      TokenType.CloseBrace,
      `Object Literal is missing a closing brace`,
    );
    return { kind: "ObjectLiteral", properties } as ObjectLiteral;
  }

  private parse_assignment_expression(): Expression {
    const left = this.parse_object_expression();

    if (this.currentToken().type == TokenType.Equals) {
      this.eat();
      const value = this.parse_assignment_expression();
      return {
        value,
        assignee: left,
        kind: "AssignmentExpression",
      } as AssignmentExpression;
    }

    return left;
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
      this.currentToken().value == "+" ||
      this.currentToken().value == "-"
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
      this.currentToken().value == "*" ||
      this.currentToken().value == "/" ||
      this.currentToken().value == "%"
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
    let left = this.parse_call_member_expression();
    while (this.currentToken().value == "^") {
      const operator = this.eat().value;
      const right = this.parse_call_member_expression();
      left = {
        kind: "Binary Expression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }
    return left;
  }

  private parse_call_member_expression(): Expression {
    // abc.func ()
    const member = this.parse_member_expression();

    if (this.currentToken().type == TokenType.ParenOpen) {
      return this.parse_call_expression(member);
    }

    return member;
  }

  private parse_call_expression(caller: Expression): Expression {
    let call_expression: Expression = {
      kind: "CallExpression",
      caller,
      arguments: this.parse_arguments(),
    } as CallExpression;

    if (this.currentToken().type == TokenType.ParenOpen) {
      call_expression = this.parse_call_expression(call_expression);
    }

    return call_expression;
  }

  private parse_arguments(): Expression[] {
    this.expect(TokenType.ParenOpen, "Expected Open Paranthesis !");
    const args =
      this.currentToken().type == TokenType.ParenClose
        ? []
        : this.parse_argument_list();

    this.expect(
      TokenType.ParenClose,
      "Missing Closing Paranthesis in argument list",
    );

    return args;
  }

  private parse_argument_list(): Expression[] {
    const args = [this.parse_expression()];

    while (
      this.notEOF() &&
      this.currentToken().type == TokenType.COMMA &&
      this.eat()
    ) {
      args.push(this.parse_assignment_expression());
    }
    return args;
  }

  private parse_member_expression(): Expression {
    let object = this.parse_primary_expression();
    while (
      this.currentToken().type == TokenType.DOT ||
      this.currentToken().type == TokenType.OpenBracket
    ) {
      const operator = this.eat();
      let property: Expression;
      let computed: boolean;

      // dot access

      if (operator.type == TokenType.DOT) {
        computed = false;
        property = this.parse_primary_expression(); // Identifier
        if (property.kind != "Identifier") throw "Illegal use of dot operator";
      } else {
        // computed
        computed = true;
        property = this.parse_expression();
        this.expect(
          TokenType.CloseBracket,
          "Missing Closing Bracket In Property Access",
        );
      }

      object = {
        kind: "MemberExpression",
        object,
        property,
      } as MemberExpression;
    }

    return object;
  }
  private parse_primary_expression(): Expression {
    const currentToken = this.currentToken().type;
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
      default:
        console.error(
          "Unexpected Token Found During Parsing",
          this.currentToken(),
        );
        process.exit(1);
    }
  }
}

# Scripto Lang

An interpreted programming language built with TypeScript, supporting basic arithmetic and a REPL interface — a humble first step into language design.

## Features

- **Basic Arithmetic**: Supports addition (`+`), subtraction (`-`), multiplication (`*`), division (`/`), and modulo (`%`) operations
- **Integer Literals**: Integer number support
- **Null Values**: Null type
- **Parentheses**: Expression grouping with parentheses
- **REPL Interface**: Read-Eval-Print Loop for testing code
- **AST Generation**: Basic Lexical analysis and parsing

## Project Structure

```
scripto-lang/
├── core/
│   ├── ast.ts          # Abstract Syntax Tree definitions
│   ├── lexer.ts        # Tokenization and lexical analysis
│   ├── parser.ts       # Parser for generating AST
│   └── utils.ts        # Utility functions
├── runtime/
│   ├── interpreter.ts  # Runtime interpreter
│   └── values.ts       # Runtime value type definitions
├── main.ts            # REPL entry point

```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- TypeScript

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd scripto-lang
```

2. Install dependencies:

```bash
npm install
```

### Running the REPL

Start the interactive REPL:

```bash
npx ts-node main.ts
```

or

```bash
npx tsx main.ts
```

You'll see the prompt:

```
Scripto-Test: V1
>>
```

### Example Usage

```
>> 5 + 3
8

>> 10 * (2 + 3)
50

>> 15 / 3 - 2
3

>> 42 % 5
2

>> null
null
```

To exit the REPL, type `yeet`

## Language Grammar

### Supported Expressions

- **Integer Literals**: `42`, `100`, `0`
- **Binary Operations**: `+`, `-`, `*`, `/`, `%`
- **Parentheses**: `(expression)`
- **Null Literal**: `null`

### Operator Precedence

1. Parentheses `()`
2. Multiplication, Division, Modulo: `*`, `/`, `%`
3. Addition, Subtraction: `+`, `-`

## Implementation Details

### Lexer

The lexer ([`core/lexer.ts`](core/lexer.ts)) tokenizes source code into tokens including:

- Numbers
- Identifiers
- Operators
- Parentheses
- Keywords (`let`, `null`)

### Parser

The parser ([`core/parser.ts`](core/parser.ts)) implements a recursive descent parser with proper operator precedence, generating an Abstract Syntax Tree (AST).

### Interpreter

The interpreter ([`runtime/interpreter.ts`](runtime/interpreter.ts)) walks the AST and evaluates expressions, supporting:

- Numeric binary operations
- Null value handling
- Runtime type checking

### Type System

The runtime type system ([`runtime/values.ts`](runtime/values.ts)) currently supports:

- `number`: Integer values
- `null`: Null values

### Building

The project uses TypeScript with ES modules. Configuration is in [`tsconfig.json`](tsconfig.json).

## Future Enhancements

- **Floating-point numbers**: Support for decimal numbers like `3.14`
- Variable declarations and assignments
- Boolean types and logical operators
- String literals and operations
- Functions and control flow
- Objects and arrays

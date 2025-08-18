# Scripto Lang

An interpreted programming language built with TypeScript, featuring basic arithmetic, functions, objects — a humble first step into language design.

## Features

- **Variables & Constants**: Support for mutable variables (`let`) and immutable constants (`const`)
- **Functions**: First-class function support with parameters and return values
- **Objects**: Object literals with property assignment using `:=` syntax
- **Arithmetic**: Basic mathematical operations (+, -, \*, /, %, ^)
- **Built-in Functions**: Native `print()` function for output
- **Lexical Scoping**: variable scoping and environment management

## Language Syntax

### Variables

```scripto
let foo = 5 * 2;
const bar = 10;
foo = foo / 4 + 5;
```

### Functions

```scripto
func add(x, y) {
  let sum = x + y;
}

const result = add(1, 4);
print(result);
```

### Objects

```scripto
const point = {
  x := 10,
  y := 3,
  func := add,
  complex := {
    imaginary := false,
  },
};
```

### Arithmetic

```scripto
let calculation = 45 / 2 * 2;
let power = 2 ^ 3; // Exponentiation
print(calculation, power);
```

## Architecture

The interpreter consists of several key components:

- **[Lexer](core/lexer.ts)**: Tokenizes source code into meaningful tokens
- **[Parser](core/parser.ts)**: Builds an Abstract Syntax Tree (AST) from tokens
- **[AST](core/ast.ts)**: Defines the structure of language constructs
- **[Interpreter](runtime/interpreter.ts)**: Executes the AST and manages runtime behavior
- **[Environment](runtime/environment.ts)**: Handles variable scoping and function calls
- **[Values](runtime/values.ts)**: Defines runtime value types and their operations

## Getting Started

### Prerequisites

- Node.js
- TypeScript (`tsx` is included as a dependency)

### Installation

```bash
git clone <repository-url>
cd scripto-lang
npm install
```

### Running Examples

```bash
# Execute example files
npx tsx  main.ts

# Or modify main.ts to run different examples:
# - examples/example.txt
# - examples/example_two.txt
# - examples/example_three.txt
```

### Project Structure

```
scripto-lang/
├── core/
│   ├── lexer.ts      # Tokenization
│   ├── parser.ts     # AST generation
│   ├── ast.ts        # AST node definitions
│   └── utils.ts      # Helper functions
├── runtime/
│   ├── interpreter.ts        # Main interpreter
│   ├── environment.ts        # Scoping & variables
│   ├── values.ts            # Runtime value types
│   └── interpreters/
│       ├── expression.ts    # Expression evaluation
│       └── statements.ts    # Statement execution
├── examples/         # Sample programs
└── main.ts          # Entry point
```

## Language Grammar

### Tokens

- **Literals**: Numbers, Identifiers
- **Operators**: `+`, `-`, `*`, `/`, `%`, `^`, `=`, `:=`
- **Delimiters**: `(`, `)`, `{`, `}`, `[`, `]`, `.`, `,`, `;`
- **Keywords**: `let`, `const`, `func`

### Operator Precedence (highest to lowest)

1. Primary expressions (literals, identifiers, parentheses)
2. Member access (`.`, `[]`)
3. Function calls
4. Exponentiation (`^`)
5. Multiplication, Division, Modulo (`*`, `/`, `%`)
6. Addition, Subtraction (`+`, `-`)
7. Assignment (`=`)

## Current Limitations

- No string literals or string operations
- No conditional statements (if/else)
- No loops (for/while)
- No arrays or list operations
- No module system or imports
- Basic error handling
- No return statements (functions return last expression)

## Contributing

This is an educational project exploring language design concepts. Feel free to:

- Add new language features
- Improve error messages
- Optimize the interpreter
- Add more built-in functions
- Implement missing language constructs

## Future Enhancements

- [ ] String support and operations
- [ ] Conditional statements and control flow
- [ ] Loop constructs
- [ ] Array/list data structures
- [ ] Better error handling and reporting
- [ ] Standard library functions
- [ ] Module system
- [ ] REPL improvements

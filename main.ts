import Parser from "./core/parser";
import { inspect } from "util";
import readline from "readline";
import { interpret } from "./runtime/interpreter";
import Environment from "./runtime/environment";
import { M_BOOL, M_NULL, M_NUMBER, NumberValue } from "./runtime/values";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function repl() {
  const parser = new Parser();
  const env = new Environment();
  env.declareVariable("x", M_NUMBER(200));
  env.declareVariable("true", M_BOOL(true));
  env.declareVariable("null", M_NULL());
  console.log("Scripto Lang Test: V1");
  function ask(): void {
    rl.question(">> ", (input: string) => {
      if (!input || input.includes("yeet")) {
        rl.close();
        process.exit(1);
      }

      const program = parser.generateAST(input);
      console.log(
        inspect(program, { showHidden: false, depth: null, colors: true }),
      );
      const result = interpret(program, env);
      console.log(result);
      ask(); // loop again
    });
  }

  ask();
}

repl();

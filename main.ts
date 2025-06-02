import Parser from "./core/parser";
import { inspect } from "util";
import readline from "readline";
import { interpret } from "./runtime/interpreter";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function repl() {
  const parser = new Parser();
  console.log("Scripto Lang Test: V1");
  function ask(): void {
    rl.question(">> ", (input: string) => {
      if (!input || input.includes("yeet")) {
        rl.close();
        process.exit(1);
      }

      const program = parser.generateAST(input);
      console.log(
        inspect(program, { showHidden: false, depth: null, colors: true })
      );
      const result = interpret(program);
      console.log(result);
      ask(); // loop again
    });
  }

  ask();
}

repl();

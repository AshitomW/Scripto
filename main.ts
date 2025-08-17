import Parser from "./core/parser";
import { inspect } from "util";
import readline from "readline";
import { interpret } from "./runtime/interpreter";
import Environment, { setupGlobalScope } from "./runtime/environment";
import { M_BOOL, M_NULL, M_NUMBER, NumberValue } from "./runtime/values";
import { promises as fs } from "fs";

async function execute(filename: string) {
  const parser = new Parser();
  const env = setupGlobalScope();

  const source = await fs.readFile(filename, "utf8");
  const program = parser.generateAST(source);
  /* console.log(
     inspect(program, { showHidden: false, depth: null, colors: true }),
   );
   */
  const result = interpret(program, env);
}

execute("./examples/example_two.txt");

/*
function repl() {
  const parser = new Parser();
  const env = new Environment();

  // default constants

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
*/

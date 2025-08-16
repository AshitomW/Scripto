import { M_BOOL, M_NULL, RuntimeValue } from "./values";

function setupScope(env: Environment) {
  env.declareVariable("true", M_BOOL(true), true);
  env.declareVariable("false", M_BOOL(false), true);
  env.declareVariable("null", M_NULL(), true);
}

// Hold structure for scopes
export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;
  private constants: Set<string>;
  constructor(parentEnv?: Environment) {
    const global = parentEnv ? true : false;
    this.parent = parentEnv;
    this.variables = new Map();
    this.constants = new Set();

    if (global) {
      setupScope(this);
    }
  }

  public declareVariable(
    varname: string,
    value: RuntimeValue,
    constant: boolean,
  ): RuntimeValue {
    if (this.variables.has(varname)) {
      throw `Cannot Redeclare Variable ${varname}`;
    }

    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }
    return value;
  }

  public assignVariable(varname: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolveVariable(varname);

    if (env.constants.has(varname)) {
      throw `Constant ${varname} Cannot Be Re assigned!`;
    }

    env.variables.set(varname, value);
    return value;
  }

  public resolveVariable(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }
    if (this.parent == undefined) {
      throw `${varname} has not yet been declared`;
    }
    return this.parent.resolveVariable(varname);
  }

  public lookUpVariable(varname: string): RuntimeValue {
    const env = this.resolveVariable(varname);
    return env.variables.get(varname) as RuntimeValue;
  }
}

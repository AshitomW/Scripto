import { RuntimeValue } from "./values";

// Hold structure for scopes
export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;

  constructor(parentEnv?: Environment) {
    this.parent = parentEnv;
    this.variables = new Map();
  }

  public declareVariable(varname: string, value: RuntimeValue): RuntimeValue {
    if (this.variables.has(varname)) {
      throw `Cannot Redeclare Variable ${varname}`;
    }
    this.variables.set(varname, value);
    return value;
  }

  public assignVariable(varname: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolveVariable(varname);
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

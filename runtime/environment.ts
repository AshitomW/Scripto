import { RuntimeValue } from "./values";

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;

  constructor(parentEnvironment?: Environment) {
    this.parent = parentEnvironment;
    this.variables = new Map();
  }

  // Function To Declare A Variable
  public declareVariable(
    variableName: string,
    value: RuntimeValue,
  ): RuntimeValue {
    if (this.variables.has(variableName)) {
      throw `Cannot Redeclare Variable ${variableName}`;
    }

    this.variables.set(variableName, value);

    return value;
  }

  public assignVariable(
    variableName: string,
    value: RuntimeValue,
  ): RuntimeValue {
    const env = this.resolve(variableName);
    env.variables.set(variableName, value);
    return value;
  }

  public resolve(variableName: string): Environment {
    // This allows us to traverse the scope of environments to find a variable we need to assign.
    if (this.variables.has(variableName)) return this;

    if (this.parent == undefined) throw `Cannot Resolve ${variableName}`;

    return this.parent.resolve(variableName);
  }

  public lookUpVariable(variableName: string): RuntimeValue {
    const env = this.resolve(variableName);
    return env.variables.get(variableName) as RuntimeValue;
  }
}

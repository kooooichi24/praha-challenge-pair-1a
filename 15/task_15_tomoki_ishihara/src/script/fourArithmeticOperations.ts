interface Operators {
  add: (...numbers: number[]) => number | string;
  multiply: (...numbers: number[]) => number | string;
  subtract: (...numbers: number[]) => number | string;
  divide: (...numbers: number[]) => number;
}

export class FourArithmeticOperations {
  private operators: Operators;
  constructor(operators: Operators) {
    this.operators = operators;
  }
  exec(operation: string, ...numbers: number[]): number | string | undefined {
    if (30 < numbers.length) {
      throw Error("Numbers length must be 30 or less.");
    }
    if (numbers.length === 0) {
      throw Error("Numbers are reuqiuried.");
    }
    switch (operation) {
      case "add":
        return this.operators.add(...numbers);
      case "multiply":
        return this.operators.multiply(...numbers);
      case "subtract":
        return this.operators.subtract(...numbers);
      case "divide":
        return this.operators.divide(...numbers);
      default:
        throw Error(
          "Operation must be one of multiply, add, subtract, divide."
        );
    }
  }
}

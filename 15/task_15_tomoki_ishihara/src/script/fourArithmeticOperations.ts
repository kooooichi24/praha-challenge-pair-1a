interface Operators {
  add: (...numbers: number[]) => number | string;
  multiply: (...numbers: number[]) => number | string;
  subtract: (...numbers: number[]) => number | string;
  divide: (...numbers: number[]) => number;
}

const NUMBERS_1_30_ERROR = Error("Numbers length must be in the range 1-30.");
const INVALID_OPERATION_ERROR = Error(
  "Operation must be one of multiply, add, subtract, divide."
);

export class FourArithmeticOperations {
  private operators: Operators;
  constructor(operators: Operators) {
    this.operators = operators;
  }
  exec(operation: string, ...numbers: number[]): number | string | undefined {
    if (numbers.length === 0 || 30 < numbers.length) {
      throw NUMBERS_1_30_ERROR;
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
        throw INVALID_OPERATION_ERROR;
    }
  }
}

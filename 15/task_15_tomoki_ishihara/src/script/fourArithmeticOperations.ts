interface Operators {
  add: (...numbers: number[]) => number | string;
  multiply: (...numbers: number[]) => number | string;
  subtract: (...numbers: number[]) => number | string;
  divide: (...numbers: number[]) => number;
}

const NUMBERS_1_30_ERROR = Error("Numbers length must be in the range 1-30.");
const NUMBERS_MUST_NUMBER_ERROR = Error("Numbers must be number.");
const INVALID_OPERATION_ERROR = Error(
  "Operation must be one of multiply, add, subtract, divide."
);
const OPERATION_REQUIRED_ERROR = Error("Operation is required.");

export class FourArithmeticOperations {
  private operators: Operators;
  constructor(operators: Operators) {
    this.operators = operators;
  }
  exec(
    operation?: string,
    ...numbers: (string | number)[]
  ): number | string | undefined {
    if (operation === undefined) {
      throw OPERATION_REQUIRED_ERROR;
    }
    if (numbers.length === 0 || 30 < numbers.length) {
      throw NUMBERS_1_30_ERROR;
    }
    const numbersConverted = numbers.map((mayBeNum) => {
      const num = parseFloat(mayBeNum.toString());
      if (Number.isNaN(num)) {
        throw NUMBERS_MUST_NUMBER_ERROR;
      } else {
        return num;
      }
    });
    switch (operation) {
      case "add":
        return this.operators.add(...numbersConverted);
      case "multiply":
        return this.operators.multiply(...numbersConverted);
      case "subtract":
        return this.operators.subtract(...numbersConverted);
      case "divide":
        return this.operators.divide(...numbersConverted);
      default:
        throw INVALID_OPERATION_ERROR;
    }
  }
}

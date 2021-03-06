interface Operators {
  add: (...numbers: number[]) => number | string;
  multiply: (...numbers: number[]) => number | string;
}

export class FourArithmeticOperations {
  private operators: Operators;
  constructor(operators: Operators) {
    this.operators = operators;
  }
  exec(operation: string, ...numbers: number[]) {
    switch (operation) {
      case "add":
        return this.operators.add(...numbers);
      case "multiply":
        return this.operators.multiply(...numbers);
    }
  }
}

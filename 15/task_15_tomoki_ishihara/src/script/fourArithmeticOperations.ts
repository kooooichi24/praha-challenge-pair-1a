import { add } from "./add";

export class FourArithmeticOperations {
  exec(operator: string, ...numbers: number[]) {
    return add(...numbers);
  }
}

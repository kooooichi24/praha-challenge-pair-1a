export const multiply = (...numbers: number[]) => {
  return numbers.reduce((prev, cur) => prev * cur, 1);
};

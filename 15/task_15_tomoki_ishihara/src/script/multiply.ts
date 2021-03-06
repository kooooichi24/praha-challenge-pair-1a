export const multiply = (...numbers: number[]): number => {
  return numbers.reduce((prev, cur) => prev * cur, 1);
};

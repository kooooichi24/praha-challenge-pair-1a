export const add = (...numbers: number[]): number => {
  return numbers.reduce((prev, cur) => prev + cur, 0);
};

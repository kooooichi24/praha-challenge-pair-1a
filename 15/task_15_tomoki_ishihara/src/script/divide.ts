export const divide = (...numbers: number[]): number => {
  const first = numbers[0];
  const rest = numbers.slice(1);
  return rest.reduce((prev, cur) => prev / cur, first);
};

export const divide = (...numbers: number[]): number => {
  const N_1e10 = 10000000000;
  const first = numbers[0];
  const rest = numbers.slice(1);
  const result = rest.reduce((prev, cur) => prev / cur, first);
  return Math.round(result * N_1e10) / N_1e10;
};

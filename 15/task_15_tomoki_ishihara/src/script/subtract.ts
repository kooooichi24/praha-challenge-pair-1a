export const subtract = (...numbers: number[]): number => {
  const first = numbers[0];
  const rest = numbers.slice(1, numbers.length);
  return rest.reduce((prev, cur) => prev - cur, first);
};

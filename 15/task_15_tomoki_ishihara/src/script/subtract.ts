export const subtract = (...numbers: number[]): string | number => {
  const first = numbers[0];
  const rest = numbers.slice(1, numbers.length);
  const result = rest.reduce((prev, cur) => prev - cur, first);
  if (result < 0) {
    return "negative number";
  } else {
    return result;
  }
};

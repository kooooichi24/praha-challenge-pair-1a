export const subtract = (...numbers: number[]): string | number => {
  const NEGATIVE_NUMBER = "negative number";
  const first = numbers[0];
  const rest = numbers.slice(1, numbers.length);
  const result = rest.reduce((prev, cur) => prev - cur, first);
  if (result < 0) {
    return NEGATIVE_NUMBER;
  } else {
    return result;
  }
};

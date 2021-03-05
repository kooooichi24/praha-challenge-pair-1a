export const add = (...numbers: number[]): string | number => {
  const result = numbers.reduce((prev, cur) => prev + cur, 0);
  if (result > 1000) {
    return "too big";
  } else {
    return result;
  }
};

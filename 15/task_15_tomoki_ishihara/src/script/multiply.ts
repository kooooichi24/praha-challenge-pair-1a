export const multiply = (...numbers: number[]): number | string => {
  const result = numbers.reduce((prev, cur) => prev * cur, 1);
  if (result > 1000) {
    return "big big number";
  } else {
    return result;
  }
};

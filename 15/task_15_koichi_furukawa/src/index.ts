/**
 * 足し算メソッド。
 *
 * ただし下記条件を含む。
 * - 引数が数値のみの場合、加算結果を返す。
 * - 引数の要素数が 31 個以上の場合、例外を返す。
 * - 加算結果が 1000 を超える場合、文字列「too big」を返す。
 *
 * @param array 数値配列
 */
export const add = (array: number[]): number | string | Error => {
  if (array.length > 30) {
    throw new Error();
  }

  const result = array.reduce((acc, cur) => {
    return acc + cur;
  }, 0);

  if (result < 1000) {
    return result;
  } else {
    return 'too big';
  }
};

/**
 * 引き算メソッド。
 *
 * ただし下記条件を含む。
 * - 引数が数値のみの場合、減算結果を返す。
 * - 引数の要素数が 31 個以上の場合、例外を返す。
 * - 加算結果が 負の場合、文字列「negative number」を返す。
 *
 * @param array 数値配列
 */
export const subtract = (array: number[]): number | string | Error => {
  if (array.length > 30) {
    throw new Error();
  }

  if (array.length === 0) {
    return 0;
  }

  const result = array.reduce((acc, cur) => {
    return acc - cur;
  });

  if (result < 0) {
    return 'negative number';
  } else {
    return result;
  }
};

/**
 * 掛け算メソッド。
 *
 * ただし下記条件を含む。
 * - 引数が数値のみの場合、乗算結果を返す。
 * - 引数の要素数が 31 個以上の場合、例外を返す。
 * - 加算結果が 1000 を超える場合、文字列「big big number」を返す。
 *
 * @param array 数値配列
 */
export const multiply = (array: number[]): number | string | Error => {
  if (array.length === 0) {
    return 0;
  }
  if (array.length > 30) {
    throw new Error();
  }

  const result = array.reduce((acc, cur) => {
    return acc * cur;
  });

  if (result < 1000) {
    return result;
  } else {
    return 'big big number';
  }
};

/**
 * 割り算メソッド。
 *
 * ただし下記条件を含む。
 * - 引数が数値のみの場合、乗算結果を返す。
 * - 引数の要素数が 31 個以上の場合、例外を返す。
 * - ゼロ除算の場合、正の無限大を返す。
 * - 0/0 の場合、NaN を返す
 *
 * @param array 数値配列
 */
export const divide = (array: number[]): number | Error => {
  if (array.length === 0) {
    return 0;
  }
  if (array.length > 30) {
    throw new Error();
  }

  return array.reduce((acc, cur) => {
    return acc / cur;
  });
};

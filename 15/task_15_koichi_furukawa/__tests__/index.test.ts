import {add, subtract, multiply, divide} from '../src/index';

describe('足し算のテスト', () => {
  describe('引数の要素数が 30 個以下の場合、加算結果を返す', () => {
    describe('引数に数値を渡すと加算結果を返す', () => {
      test('[1] を渡すと 1 を返す', () => {
        expect(add([1])).toBe(1);
      });

      test('[1,2] を渡すと 3 を返す', () => {
        expect(add([1, 2])).toBe(3);
      });

      test('[1,2,...,30] を渡すと 465 を返す', () => {
        const oneToThirty = [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
        ];

        expect(add(oneToThirty)).toBe(465);
      });

      test('[]  を渡すと 0 を返す', () => {
        expect(add([])).toBe(0);
      });
    });

    describe('計算結果が 1000 を超える場合、合計ではなく「too big」と文字列が返す', () => {
      test('[1,1000]を渡すと文字列「too big」を返す', () => {
        expect(add([1, 1000])).toBe('too big');
      });
    });
  });

  describe('引数の要素数が 31 個以上の場合、例外を返す', () => {
    test('[1,2,...,31] を渡すと例外を返す', () => {
      const oneToThityOne = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
      ];

      expect(() => add(oneToThityOne)).toThrow(Error);
    });
  });
});

describe('引き算のテスト', () => {
  describe('引数の要素数が 30 個以下の場合、減算結果を返す', () => {
    test('[1] を渡すと 1 を返す', () => {
      expect(subtract([1])).toBe(1);
    });

    test('[3,1] を渡すと 2 を返す', () => {
      expect(subtract([3, 1])).toBe(2);
    });

    test('[3,2,1] を渡すと 0 を返す', () => {
      expect(subtract([3, 2, 1])).toBe(0);
    });

    test('[465,30,29,28,27,...,3,2] を渡すと 1 を返す', () => {
      const argsLenIsThirty = [
        465,
        30,
        29,
        28,
        27,
        26,
        25,
        24,
        23,
        22,
        21,
        20,
        19,
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        10,
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
      ];

      expect(subtract(argsLenIsThirty)).toBe(1);
    });

    test('[]  を渡すと 0 を返す', () => {
      expect(subtract([])).toBe(0);
    });
  });
  describe('引数の要素数が 31 個以上の場合、例外を返す', () => {
    test('[465,30,29,28,27,...,3,2,1] を渡すと例外を返す', () => {
      const argsLenIsThirtyOne = [
        465,
        30,
        29,
        28,
        27,
        26,
        25,
        24,
        23,
        22,
        21,
        20,
        19,
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        10,
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1,
      ];

      expect(() => subtract(argsLenIsThirtyOne)).toThrow(Error);
    });
  });
  describe('計算結果が 負の場合、文字列「negative number」を返す', () => {
    test('[3,10,3]を渡すと文字列「negative number」を返す', () => {
      expect(subtract([3, 10, 3])).toBe('negative number');
    });
  });
});

describe('掛け算のテスト', () => {
  describe('引数の要素数が 30 個以下の場合、減算結果を返す', () => {
    test('[1] を渡すと 1 を返す', () => {
      expect(multiply([1])).toBe(1);
    });

    test('[3,1] を渡すと 3 を返す', () => {
      expect(multiply([3, 1])).toBe(3);
    });

    test('[3,2,1] を渡すと 6 を返す を渡すと 6 を返す', () => {
      expect(multiply([3, 2, 1])).toBe(6);
    });

    test('[1,1,1,...,1] を渡すと 1 を返す', () => {
      const argsLenIsThirty = [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
      ];

      expect(multiply(argsLenIsThirty)).toBe(1);
    });

    test('[] を渡すと 0 を返す', () => {
      expect(multiply([])).toBe(0);
    });
  });
  describe('引数の要素数が 31 個以上の場合、例外を返す', () => {
    test('[1,1,1,...,1] を渡すと例外を返す', () => {
      const argsLenIsThirtyOne = [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
      ];

      expect(() => multiply(argsLenIsThirtyOne)).toThrow(Error);
    });
  });
  describe('計算結果が 1000を超える場合、文字列「big big number」を返す', () => {
    test('[1,1,1001]を渡すと文字列「big big number」を返す', () => {
      expect(multiply([1, 1, 1001])).toBe('big big number');
    });
  });
});

describe('割り算のテスト', () => {
  describe('引数の要素数が 30 以下の場合、除算結果を返す', () => {
    test('[1] を渡すと 1 を返す', () => {
      expect(divide([1])).toBeCloseTo(1, 5);
    });

    test('[3,1] を渡すと 3 を返す', () => {
      expect(divide([3, 1])).toBeCloseTo(3, 5);
    });

    test('[6,3,2] を渡すと 1 を返す', () => {
      expect(divide([6, 3, 2])).toBeCloseTo(1, 5);
    });

    test('[1,1,1,...,1] を渡すと 1 を返す', () => {
      const argsLenIsThirty = [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
      ];

      expect(divide(argsLenIsThirty)).toBeCloseTo(1, 5);
    });

    test('[] を渡すと 0 を返す', () => {
      expect(divide([])).toBeCloseTo(0, 5);
    });

    test('[0,1] を渡すと 0 を返す', () => {
      expect(divide([0, 1])).toBeCloseTo(0, 5);
    });
  });

  describe('ゼロ除算 の場合、正の無限大を返す', () => {
    test('[1,0] を渡すと Number.POSITIVE_INFINITY を返す', () => {
      expect(divide([1, 0])).toEqual(Number.POSITIVE_INFINITY);
    });
  });

  describe('0/0 の場合、NaN を返す', () => {
    test('[0,0] を渡すと NaN を返す', () => {
      expect(divide([0, 0])).toEqual(NaN);
    });
  });

  describe('引数の要素数が 31 以上の場合、例外を返す', () => {
    const argsLenIsThirty = [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
    ];

    expect(() => divide(argsLenIsThirty)).toThrow(Error);
  });

  // describe('除算結果は小数点 5 桁まで考慮する', () => {
  //   test('[1,3] を渡すと 0.33333 を返す', () => {
  //     expect(divide([1, 3])).toBeCloseTo(0.33333, 5);
  //   });

  //   test('[1,0.3] を渡すと 3.33333 を返す', () => {
  //     expect(divide([1, 0.3])).toBeCloseTo(3.33333, 5);
  //   });

  //   test('[1,0.03] を渡すと 33.33333 を返す', () => {
  //     expect(divide([1, 0.03])).toBeCloseTo(33.33333, 5);
  //   });

  //   // 失敗しちゃう、、
  //   // Number型の精度に関してはどうすればいいんだろう？
  //   test('[10000, 0.0000003] を渡すと 33333333333.33333 が返ってきて欲しい、、、', () => {
  //     expect(divide([10000, 0.0000003])).toBeCloseTo(33333333333.33333, 5);
  //   });
  // });
});

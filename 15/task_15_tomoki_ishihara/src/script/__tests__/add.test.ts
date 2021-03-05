import { add } from "../add";

describe("add関数は引数を全て加算して結果を返す", () => {
  describe("引数を全て加算する", () => {
    it("1, 1 を受け取ると 2 を返す", () => {
      // 実行 & 検証
      expect(add(1, 1)).toBe(2);
    });
    it("1, 1, 1 を受け取ると 3 を返す", () => {
      // 実行 & 検証
      expect(add(1, 1, 1)).toBe(3);
    });
  });
  describe(`計算結果が1000を超える場合は "too big" を返す`, () => {
    it(`1001 を渡すと "too big" を返す`, () => {
      // 実行 & 検証
      expect(add(1001)).toBe("too big");
    });
  });
});

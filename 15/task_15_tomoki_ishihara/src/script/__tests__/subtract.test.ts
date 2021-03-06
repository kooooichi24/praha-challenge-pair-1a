import { subtract } from "../subtract";

describe("subtract関数は先頭の引数から残りの引数を減算して結果を返す", () => {
  describe("結果が0以上の場合は結果をそのまま返す", () => {
    it("10, 1 を渡すと 9 を返す", () => {
      expect(subtract(10, 1)).toBe(9);
    });
    it("10, 2, 1 を渡すと 7 を返す", () => {
      expect(subtract(10, 2, 1)).toBe(7);
    });
  });
});

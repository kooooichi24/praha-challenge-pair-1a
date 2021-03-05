import { subtract } from "../subtract";

describe("subtract関数は引数を全て減算して結果を返す", () => {
  describe("引数を全て加算する", () => {
    it("10, 1 を渡すと 9 を返す", () => {
      expect(subtract(10, 1)).toBe(9);
    });
  });
});

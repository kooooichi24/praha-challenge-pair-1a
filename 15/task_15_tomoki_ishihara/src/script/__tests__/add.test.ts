import { add } from "../add";

describe("add関数は引数を全て加算して結果を返す", () => {
  describe("引数を全て加算する", () => {
    it("1, 1 を受け取ると 2 を返す", () => {
      const actual = add(1, 1);
      expect(actual).toBe(2);
    });
  });
});

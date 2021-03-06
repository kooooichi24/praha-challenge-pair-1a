import { divide } from "../divide";

describe("divide 関数は先頭の引数から残りの引数を除算して結果を返す", () => {
  describe("結果の少数点以下の桁数が10桁未満の場合はそのまま返す", () => {
    it("10, 2 を渡すと 5 を返す", () => {
      expect(divide(10, 2)).toBeCloseTo(5, 10);
    });
  });
});

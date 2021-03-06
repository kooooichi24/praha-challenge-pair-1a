import { FourArithmeticOperations } from "../fourArithmeticOperations";
import { add } from "../add";
import { multiply } from "../multiply";
import { subtract } from "../subtract";

describe("fourArithmeticOperationsクラスは四則演算を実行する", () => {
  describe("exec関数は渡された引数に対して計算を行い結果を返す", () => {
    let fourArithmeticOperations: FourArithmeticOperations;
    beforeEach(() => {
      fourArithmeticOperations = new FourArithmeticOperations({
        add,
        multiply,
        subtract,
      });
    });
    describe("先頭の引数 (任意の文字列) をみて、対応する計算を実行する", () => {
      describe("先頭が multiply の場合 multiply関数を実行する", () => {
        it(`"multiply", 2, 3 を渡すと 6 を返す`, () => {
          expect(fourArithmeticOperations.exec("multiply", 2, 3)).toBe(6);
        });
      });
      describe("先頭が add の場合 add関数を実行する", () => {
        it(`"add", 1, 1 を渡すと 2を返す`, () => {
          expect(fourArithmeticOperations.exec("add", 1, 1)).toBe(2);
        });
      });
      describe("先頭が subtract の場合 subtract関数を実行する", () => {
        it(`"subtract", 10, 3 を渡すと 7 を返す`, () => {
          expect(fourArithmeticOperations.exec("subtract", 10, 3)).toBe(7);
        });
      });
    });
  });
});

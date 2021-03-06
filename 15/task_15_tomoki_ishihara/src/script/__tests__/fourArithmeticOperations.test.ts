import { FourArithmeticOperations } from "../fourArithmeticOperations";
import { add } from "../add";

describe("fourArithmeticOperationsクラスは四則演算を実行する", () => {
  describe("exec関数は渡された引数に対して計算を行い結果を返す", () => {
    describe("先頭の引数 (multiply/add/subtract/divide) をみて、対応する計算を実行する", () => {
      describe("先頭が add の場合 add関数を実行する", () => {
        it(`"add", 1, 1 を渡すと 2を返す`, () => {
          const fourArithmeticOperations = new FourArithmeticOperations({
            add,
          });
          expect(fourArithmeticOperations.exec("add", 1, 1)).toBe(2);
        });
      });
    });
  });
});

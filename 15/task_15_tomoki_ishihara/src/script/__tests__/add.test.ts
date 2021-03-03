
it("test test", () => {
  const isEven = (num: number): boolean => num % 2 === 0
  // type error が発生し、テストが実行されない
  expect(isEven("100")).toBe(false)
})

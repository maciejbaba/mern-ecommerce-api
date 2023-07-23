const PORT = require("../config/PORT");

describe("PORT", () => {
  test("PORT is defined", () => {
    expect(PORT).toBeDefined();
  });
  test("PORT is a number", () => {
    expect(typeof PORT).toBe("number");
  });
  test("PORT is not empty", () => {
    expect(PORT).toBeGreaterThan(0);
  });
  test("PORT is 3500 when process.env.NODE_ENV equals 'development'", () => {
    process.env.NODE_ENV = "development";
    expect(PORT).toBe(3500);
  });
});

const PORT = require("../config/PORT");

describe("PORT", () => {
  test("PORT is a number", () => {
    expect(typeof PORT).toBe("number");
  });

  test("PORT is not empty", () => {
    expect(PORT).toBeGreaterThan(0);
  });

  if (process.env.NODE_ENV === "development") {
    test("PORT is 3500", () => {
      expect(PORT).toBe(3500);
    });
  }
});

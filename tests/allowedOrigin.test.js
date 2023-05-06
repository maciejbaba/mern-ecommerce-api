const allowedOrigin = require("../config/allowedOrigin");

test("allowedOrigin is a string", () => {
  expect(typeof allowedOrigin).toBe("string");
});

test("allowedOrigin is not empty", () => {
  expect(allowedOrigin.length).toBeGreaterThan(0);
});

test("allowedOrigin is either localhost or vercel", () => {
  expect(allowedOrigin).toMatch(/localhost|vercel/);
});


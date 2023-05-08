const allowedOrigin = require("../config/allowedOrigin");

test("allowedOrigin is a string", () => {
  expect(typeof allowedOrigin).toBe("string");
});

test("allowedOrigin is not empty", () => {
  expect(allowedOrigin.length).toBeGreaterThan(0);
});

test("allowedOrigin is localhost when process.env.NODE_ENV equals development", () => {
  process.env.NODE_ENV = "development";
  const allowedOrigin = require("../config/allowedOrigin");
  expect(allowedOrigin).toBe("http://localhost:3000");
});

test("allowedOrigin is vercel when process.env.NODE_ENV equals production", () => {
  jest.resetModules();
  process.env.NODE_ENV = "production";
  const allowedOrigin = require("../config/allowedOrigin");
  expect(allowedOrigin).toBe("https://mern-ecommerce-beta.vercel.app");
});

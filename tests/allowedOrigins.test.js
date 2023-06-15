const allowedOrigins = require("../config/allowedOrigins");

describe("AllowedOrigins", () => {
  test("allowedOrigins is a object", () => {
    expect(typeof allowedOrigins).toBe("object");
  });

  test("allowedOrigins is not empty", () => {
    expect(allowedOrigins.length).toBeGreaterThan(0);
  });

  test("allowedOrigins are localhost when process.env.NODE_ENV equals development", () => {
    process.env.NODE_ENV = "development";
    const allowedOrigins = require("../config/allowedOrigins");
    expect(
      allowedOrigins.includes(
        "http://localhost:5173" || "http://localhost:3500"
      )
    ).toBe(true);
  });

  test("allowedOrigins is vercel when process.env.NODE_ENV equals production", () => {
    jest.resetModules();
    process.env.NODE_ENV = "production";
    const allowedOrigins = require("../config/allowedOrigins");
    expect(
      allowedOrigins.includes("https://mern-ecommerce-beta.vercel.app")
    ).toBe(true);
  });
});

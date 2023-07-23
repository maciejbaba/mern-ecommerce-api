const allowedOrigins = require("../config/allowedOrigins");

describe("AllowedOrigins", () => {
  test("allowedOrigins is defined", () => {
    expect(allowedOrigins).toBeDefined();
  });
  test("allowedOrigins is an array", () => {
    expect(allowedOrigins).toBeInstanceOf(Array);
  });

  test("allowedOrigins is not empty", () => {
    expect(allowedOrigins.length).toBeGreaterThan(0);
  });

  test("allowedOrigins contains localhost when process.env.NODE_ENV equals development", () => {
    process.env.NODE_ENV = "development";
    const allowedOrigins = require("../config/allowedOrigins");
    expect(
      allowedOrigins.includes(
        "http://localhost:5173" || "http://localhost:3500"
      )
    ).toBe(true);
  });

  test("allowedOrigins contains vercel when process.env.NODE_ENV equals production", () => {
    jest.resetModules();
    process.env.NODE_ENV = "production";
    const allowedOrigins = require("../config/allowedOrigins");
    expect(
      allowedOrigins.includes("https://mern-ecommerce-beta.vercel.app")
    ).toBe(true);
  });
});

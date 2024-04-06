import request from "supertest";

// so basically we are testing the request limiter middleware
// this file doesnt have test.js in order to not be includes in jest tests
// so it is possible to change requestLimiter middleware max option to f.e. 3 and manually test it via postman or this file
// but other tests will fail because of the request limiter middleware

const baseUrl = "http://localhost:3500/auth";

const req = async () =>
  await request(baseUrl).post("/login").send({
    username: "test",
    password: "test",
  });

// change max option in requestLimiter middleware to 3 and manually test it via postman or add test.js extension to this file
describe("Request Limiter", () => {
  test("should return 429 when request limit is exceeded", async () => {
    await req();
    await req();
    await req();
    const response = await req();
    expect(response.status).toBe(429);
  });
});

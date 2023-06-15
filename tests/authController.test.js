import request from "supertest";

const baseUrl = "http://localhost:3500/auth";

const loginRequest = async (body) => {
  return request(baseUrl).post("/login").send(body);
};

describe("Auth Controller", () => {
  test("should return 200 when login is successful", async () => {
    const body = {
      username: "test",
      password: "test",
    };
    const response = await loginRequest(body);
    expect(response.status).toBe(200);
  });
  test("should return 400 when username is missing", async () => {
    const body = {
      password: "test",
    };
    const response = await loginRequest(body);
    expect(response.status).toBe(400);
  });
  test("should return 400 when password is missing", async () => {
    const body = {
      username: "test",
    };
    const response = await loginRequest(body);
    expect(response.status).toBe(400);
  });
  test("should return 400 when both username and password are missing", async () => {
    const body = {};
    const response = await loginRequest(body);
    expect(response.status).toBe(400);
  });
  test("should return 401 when password is incorrect", async () => {
    const body = {
      username: "test",
      password: "wrong",
    };
    const response = await loginRequest(body);
    expect(response.status).toBe(401);
  });
  test("should return 401 when username is incorrect", async () => {
    const body = {
      username: "wrong",
      password: "test",
    };
    const response = await loginRequest(body);
    expect(response.status).toBe(401);
  });
});

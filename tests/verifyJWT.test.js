import request from "supertest";

const baseUrl = "http://localhost:3500";

const fetchAccessToken = async () => {
  const response = await request(baseUrl).post("/auth/login").send({
    username: "test",
    password: "test",
  });

  const { accessToken } = await response.body;

  return accessToken;
};

const requestWithoutAuthHeader = async () => {
  const response = await request(baseUrl)
    .delete("/items")
    .send({ name: "some item" });
  return response;
};

const requestWithBadAuth = async () => {
  const response = await request(baseUrl)
    .delete("/items")
    .set("Authorization", "Bearer BADTOKEN")
    .send({ name: "some item" });
  return response;
};

describe("JWT Controller", () => {
  test("should return 401 if token is missing", async () => {
    const response = await requestWithoutAuthHeader();
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "No auth header" });
  });
  test("should return 401 if authorization header not startsWith Bearer", async () => {
    const response = await request(baseUrl)
      .delete("/items")
      .set("Authorization", "BADTOKEN")
      .send({ name: "some item" });
    expect(response.status).toBe(401);
  });
  test("should return 403 if token is invalid", async () => {
    const response = await requestWithBadAuth();
    expect(response.status).toBe(403);
  });
});

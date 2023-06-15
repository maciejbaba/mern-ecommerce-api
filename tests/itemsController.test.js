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

const createTestItem = async () => {
  const accessToken = await fetchAccessToken();
  const response = await request(baseUrl)
    .post("/items")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      name: "test",
      description: "test",
      price: 1,
    });
  return response;
};

const deleteTestItem = async () => {
  const accessToken = await fetchAccessToken();
  const response = await request(baseUrl)
    .delete("/items")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      name: "test",
    });
  return response;
};

describe("Items Controller", () => {
  describe("GET /items", () => {
    test("should return a list of items", async () => {
      const response = await request(baseUrl).get("/items");
      expect(response.status).toBe(200);
    });
  });
  describe("POST /items", () => {
    test("should create a new item", async () => {
      const response = await createTestItem();
      expect(response.status).toBe(201);
      deleteTestItem();
    });
    test("should return 400 if name is missing", async () => {
      const response = await request(baseUrl).post("/items").send({
        description: "test",
        price: 1,
      });
      expect(response.status).toBe(400);
    });
    test("should return 400 if description is missing", async () => {
      const response = await request(baseUrl).post("/items").send({
        name: "test",
        price: 1,
      });
      expect(response.status).toBe(400);
    });
    test("should return 400 if price is missing", async () => {
      const response = await request(baseUrl).post("/items").send({
        name: "test",
        description: "test",
      });
      expect(response.status).toBe(400);
    });
    test("should return 400 if name is empty", async () => {
      const response = await request(baseUrl).post("/items").send({
        name: "",
        description: "test",
        price: 1,
      });
      expect(response.status).toBe(400);
    });
    test("should return 400 if description is empty", async () => {
      const response = await request(baseUrl).post("/items").send({
        name: "test",
        description: "",
        price: 1,
      });
      expect(response.status).toBe(400);
    });
    test("should return 400 if price is empty", async () => {
      const response = await request(baseUrl).post("/items").send({
        name: "test",
        description: "test",
        price: "",
      });
      expect(response.status).toBe(400);
    });
    test("should return 400 if price is not a number", async () => {
      const response = await request(baseUrl).post("/items").send({
        name: "test",
        description: "test",
        price: "test",
      });
      expect(response.status).toBe(400);
    });
    test("should return 400 if price is negative", async () => {
      const response = await request(baseUrl).post("/items").send({
        name: "test",
        description: "test",
        price: -1,
      });
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /items", () => {
    test("should delete an item", async () => {
      await createTestItem();
      const response = await deleteTestItem();
      expect(response.status).toBe(200);
    });
    test("should return 400 if name is missing", async () => {
      const accessToken = await fetchAccessToken();
      const response = await request(baseUrl)
        .delete("/items")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({});
      expect(response.status).toBe(400);
    });
    test("should return 400 if name is empty", async () => {
      const accessToken = await fetchAccessToken();
      const response = await request(baseUrl)
        .delete("/items")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "",
        });
      expect(response.status).toBe(400);
    });
    test("should return 404 if item does not exist", async () => {
      const accessToken = await fetchAccessToken();
      // we don't create test item here
      // in order to create test item we need to call createTestItem() which isn't called in this test
      const response = await request(baseUrl)
        .delete("/items")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "test",
        });
      expect(response.status).toBe(404);
    });
  });
});

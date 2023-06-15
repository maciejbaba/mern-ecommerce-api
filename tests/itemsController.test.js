import request from "supertest";

const baseUrl = "http://localhost:3500";

const fetchAccessToken = async () => {
  const response = await request(baseUrl).post("/auth/login").send({
    name: "test",
    password: "test",
  });

  return response.body.accessToken;
};

const accessToken = fetchAccessToken();

describe("Items Controller", () => {
  describe("GET /items", () => {
    test("should return a list of items", async () => {
      const response = await request(baseUrl).get("/items");
      expect(response.status).toBe(200);
    });
  });
  describe("POST /items", () => {
    test("should create a new item", async () => {
      const response = await request(baseUrl).post("/items").send({
        name: "test",
        description: "test",
        price: 1,
      });
      expect(response.status).toBe(201);
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
      const response =  
        await request(baseUrl).delete("/items").set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "test",
        });
      expect(response.status).toBe(200);
    });
    // test("should return 400 if name is missing", async () => {
    //   const response = await request(baseUrl).delete("/items").send({});
    //   expect(response.status).toBe(400);
    // });
    // test("should return 400 if name is empty", async () => {
    //   const response = await request(baseUrl).delete("/items").send({
    //     name: "",
    //   });
    //   expect(response.status).toBe(400);
    // });
  });
});

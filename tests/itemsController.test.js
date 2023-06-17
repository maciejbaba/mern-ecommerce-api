import { be } from "date-fns/locale";
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

let token;

beforeAll(async () => {
  const accessToken = await fetchAccessToken();
  token = accessToken;
});

const getTestItemId = async () => {
  const response = await request(baseUrl).get("/items");
  const testItem = response.body.find((item) => item.name === "test");
  return testItem._id; // id == _id
};

const createTestItem = async () => {
  const response = await request(baseUrl)
    .post("/items")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "test",
      description: "test",
      price: 1,
    });
  return response;
};

const updateTestItem = async () => {
  const testItemId = await getTestItemId();
  const response = await request(baseUrl)
    .patch("/items")
    .set("Authorization", `Bearer ${token}`)
    .send({
      id: testItemId,
      name: "test",
      description: "test1",
      price: 2,
      photoURL: "test1",
    });
  return response;
};

const deleteTestItem = async () => {
  const testItemId = await getTestItemId();
  const response = await request(baseUrl)
    .delete("/items")
    .set("Authorization", `Bearer ${token}`)
    .send({
      id: testItemId,
    });
  return response;
};

describe("Items Controller", () => {
  describe("GET /items", () => {
    test("should return 200", async () => {
      const response = await request(baseUrl).get("/items");
      expect(response.status).toBe(200);
    });
    test("should return an array", async () => {
      const response = await request(baseUrl).get("/items");
      expect(response.body).toBeInstanceOf(Array);
    });
    test("should return an array with length > 0", async () => {
      const response = await request(baseUrl).get("/items");
      expect(response.body.length).toBeGreaterThan(0);
    });
    test("should return an array of items", async () => {
      const response = await request(baseUrl).get("/items");
      const item = response.body[0];
      expect(item).toHaveProperty("_id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("price");
      expect(item).toHaveProperty("photoURL");
    });
  });

  describe("POST /items", () => {
    test("should return 201 when item created", async () => {
      const response = await createTestItem();
      expect(response.status).toBe(201);
      await deleteTestItem();
    });
    test("should return 'New item has been created' when item created", async () => {
      const response = await createTestItem();
      expect(response.body.message).toBe("New item has been created");
      await deleteTestItem();
    });
    test("should return 409 if item already exists", async () => {
      await createTestItem();
      const response = await createTestItem();
      expect(response.status).toBe(409);
      await deleteTestItem();
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

  describe("PATCH /items", () => {
    test("should return 200 when item updated", async () => {
      await createTestItem();
      const response = await updateTestItem();
      expect(response.status).toBe(200);
      await deleteTestItem();
    });
    test("should return 'Item has been updated' when item updated", async () => {
      await createTestItem();
      const response = await updateTestItem();
      expect(response.body.message).toBe("Item has been updated");
      await deleteTestItem();
    });
    test("should return 400 if id is missing", async () => {
      const response = await request(baseUrl)
        .patch("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test",
          description: "test",
          price: 1,
          photoURL: "test",
        });
      expect(response.status).toBe(400);
    });
    test("should return 400 if name is missing", async () => {
      const response = await request(baseUrl)
        .patch("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: "test",
          description: "test",
          price: 1,
          photoURL: "test",
        });
      expect(response.status).toBe(400);
    });
    test("should return 400 if description is missing", async () => {
      const response = await request(baseUrl)
        .patch("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: "test",
          name: "test",
          price: 1,
          photoURL: "test",
        });
      expect(response.status).toBe(400);
    });
    test("should return 400 if price is missing", async () => {
      const response = await request(baseUrl)
        .patch("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: "test",
          name: "test",
          description: "test",
          photoURL: "test",
        });
      expect(response.status).toBe(400);
    });
    test("should return 400 if name is empty", async () => {
      const response = await request(baseUrl)
        .patch("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: "test",
          name: "",
          description: "test",
          price: 1,
          photoURL: "test",
        });
      expect(response.status).toBe(400);
    });
    test("should return 400 if description is empty", async () => {
      const response = await request(baseUrl)
        .patch("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: "test",
          name: "test",
          description: "",
          price: 1,
          photoURL: "test",
        });
      expect(response.status).toBe(400);
    });
    test("should return 400 if price is empty", async () => {
      const response = await request(baseUrl)
        .patch("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: "test",
          name: "test",
          description: "test",
          price: "",
          photoURL: "test",
        });
      expect(response.status).toBe(400);
    });
    test("should return 400 if price is not a number", async () => {
      const response = await request(baseUrl)
        .patch("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: "test",
          name: "test",
          description: "test",
          price: "test",
          photoURL: "test",
        });
      expect(response.status).toBe(400);
    });
    test("should return 400 if price is negative", async () => {
      const response = await request(baseUrl)
        .patch("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: "test",
          name: "test",
          description: "test",
          price: -1,
          photoURL: "test",
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
    test("should return 400 if id is missing", async () => {
      const response = await request(baseUrl)
        .delete("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
    });
    test("should return 400 if id is empty", async () => {
      const response = await request(baseUrl)
        .delete("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: "",
        });
      expect(response.status).toBe(400);
    });
    test("should return 404 if item does not exist", async () => {
      await createTestItem();
      const testItemId = await getTestItemId();
      await deleteTestItem();
      const response = await request(baseUrl)
        .delete("/items")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: testItemId,
        });
      expect(response.status).toBe(404);
    });
  });
});

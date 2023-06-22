import request from "supertest";

const baseUrl = "http://localhost:3500";

// test user is used here as an authenticated user
// test1 user is used as a user to be tested
// test2 user is used as a user updated from test1 user

const fetchAccessToken = async () => {
  const response = await request(baseUrl).post("/auth/login").send({
    username: "test",
    password: "test",
  });

  const { accessToken } = await response.body;

  return accessToken;
};

const createTestUser = async () => {
  const response = await request(baseUrl).post("/users").send({
    username: "test1",
    password: "test1",
  });
  return response;
};

let token;

beforeAll(async () => {
  const accessToken = await fetchAccessToken();
  token = accessToken;
});

const fetchTestUserIdByUsername = async (username) => {
  const response = await request(baseUrl).get("/users");
  const user = response.body.find((user) => user.username === username);
  return user._id;
};

const deleteTestUser = async () => {
  const id = await fetchTestUserIdByUsername("test1");
  const response = await request(baseUrl)
    .delete("/users")
    .set("Authorization", `Bearer ${token}`)
    .send({
      id,
    });
  return response;
};

const updateTestUser = async () => {
  const id = await fetchTestUserIdByUsername("test1");
  const response = await request(baseUrl)
    .patch("/users")
    .set("Authorization", `Bearer ${token}`)
    .send({
      id,
      username: "test2",
      password: "test2",
      active: false,
      isAdmin: true,
    });
  return response;
};

const deleteUpdatedTestUser = async () => {
  const id = await fetchTestUserIdByUsername("test2");
  const response = await request(baseUrl)
    .delete("/users")
    .set("Authorization", `Bearer ${token}`)
    .send({
      id,
    });
  return response;
};

describe("Users controller", () => {
  describe("GET /users", () => {
    test("should return 200", async () => {
      const response = await request(baseUrl).get("/users");
      expect(response.status).toBe(200);
    });
    test("should return an array", async () => {
      const response = await request(baseUrl).get("/users");
      expect(response.body).toBeInstanceOf(Array);
    });
    test("should return an array with length > 0", async () => {
      const response = await request(baseUrl).get("/users");
      expect(response.body.length).toBeGreaterThan(0);
    });
    test("should return an array of users", async () => {
      const response = await request(baseUrl).get("/users");
      const user = response.body[0];
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("active");
      expect(user).toHaveProperty("isAdmin");
    });
  });
  describe("POST /users", () => {
    test("should return 201", async () => {
      const response = await createTestUser();
      expect(response.status).toBe(201);
      await deleteTestUser();
    });
    test("should return an object", async () => {
      const response = await createTestUser();
      expect(response.body).toBeInstanceOf(Object);
      await deleteTestUser();
    });
    test("should return response with message", async () => {
      const response = await createTestUser();
      expect(response.body).toHaveProperty("message");
      await deleteTestUser();
    });
    test("should return response with message 'New user test1 created'", async () => {
      const response = await createTestUser();
      expect(response.body.message).toBe("New user test1 created");
      await deleteTestUser();
    });
    test("should return 400 if username is not provided", async () => {
      const response = await request(baseUrl).post("/users").send({
        password: "test1",
      });
      expect(response.status).toBe(400);
    });
    test("should return 400 if password is not provided", async () => {
      const response = await request(baseUrl).post("/users").send({
        username: "test1",
      });
      expect(response.status).toBe(400);
    });
    test("should return 409 if username already exists", async () => {
      await createTestUser();
      const response = await createTestUser();
      expect(response.status).toBe(409);
      await deleteTestUser();
    });
  });
  describe("PATCH /users", () => {
    test("should return 200", async () => {
      await createTestUser();
      const response = await updateTestUser();
      expect(response.status).toBe(200);
      await deleteUpdatedTestUser();
    });
    test("should return an object", async () => {
      await createTestUser();
      const response = await updateTestUser();
      expect(response.body).toBeInstanceOf(Object);
      await deleteUpdatedTestUser();
    });
    test("should return response with message", async () => {
      await createTestUser();
      const response = await updateTestUser();
      expect(response.body).toHaveProperty("message");
      await deleteUpdatedTestUser();
    });
    test("should return response with message 'User test1 updated'", async () => {
      await createTestUser();
      const response = await updateTestUser();
      expect(response.body.message).toBe(
        "User test1 has been updated to test2"
      );
      await deleteUpdatedTestUser();
    });
    test("should return response with message 'User test1 has been updated' when username is not changed", async () => {
      await createTestUser();
      const id = await fetchTestUserIdByUsername("test1");
      const response = await request(baseUrl)
        .patch("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          id,
          password: "test2",
          active: false,
          isAdmin: true,
        });
      expect(response.body.message).toBe("User test1 has been updated");
      await deleteTestUser();
    });
    test("should return 400 if id is not provided", async () => {
      await createTestUser();
      const response = await request(baseUrl)
        .patch("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "test2",
          password: "test2",
          active: false,
          isAdmin: true,
        });
      expect(response.status).toBe(400);
      await deleteTestUser();
    });
  });
});

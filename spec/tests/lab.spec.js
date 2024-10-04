const request = require("supertest");
const app = require("../..");
const { clearDatabase } = require("../../db.connection");
const req = request(app);

describe("lab testing:", () => {
  let mockUser,mockUser2, userToken, newToken, todoInDB;
  beforeAll(async () => {
    mockUser = { name: "Mohamed", email: "Mohamed@gmail.com", password: "123456789" };
    mockUser2 = { name: "Mohran", email: "Mohran@gmail.com", password: "987654321" };

    await req.post("/user/signup").send(mockUser);
    await req.post("/user/signup").send(mockUser2);

    const login = await req.post("/user/login").send(mockUser);
    userToken = login.body.data;

    const login2 = await req.post("/user/login").send(mockUser2);
    newToken = login2.body.data;

    const newTodo = await req.post("/todo").send({ title: "Test Todo" }).set({ authorization: userToken });
    todoInDB = newTodo.body.data;
  });
  describe("users routes:", () => {
    it("req to get(/user/search) ,expect to get the correct user with his name", async () => {
      let res = await req.get("/user/search").query({ name: mockUser.name });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(mockUser.name);
    });
    it("req to get(/user/search) with invalid name ,expect res status and res message to be as expected", async () => {
      let res = await req.get("/user/search").query({ name: "ahmed" });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("There is no user with name");
    });
  });

  describe("todos routes:", () => {
    it("req to patch( /todo/) with id only ,expect res status and res message to be as expected", async () => {
      let res = await req
        .patch(`/todo/${todoInDB._id}`)
        .set({ authorization: userToken });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("you should Add title here");
    });

    it("req to patch( /todo/) with id and title ,expect res status and res to be as expected", async () => {
      let res = await req
        .patch(`/todo/${todoInDB._id}`)
        .send({ title: "updated Todo" })
        .set({ authorization: userToken });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("updated Todo");
    });

    it("req to get( /todo/user) ,expect to get all user's todos", async () => {
      let res = await req.get("/todo/user").set({ authorization: userToken });
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it("req to get( /todo/user) ,expect to not get any todos for user hasn't any todo", async () => {
      let res = await req.get("/todo/user").set({ authorization: newToken });
      expect(res.body.message).toContain("Not Found the Todo of id"); 
    });
  });

  afterAll(async () => {
    await clearDatabase();
  });
});

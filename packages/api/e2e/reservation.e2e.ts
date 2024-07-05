import request from "supertest";
import app from "../../api/src/index";
import { AppDataSource } from "../../api/src/index";
import "jest";

describe("Reservation API Endpoints", () => {
  let authToken: string;

  beforeAll(async () => {
    // Initialize the database connection
    await AppDataSource.initialize();

    // Log in to get the authorization token
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: "alan.ortega.mh@gmail.com", password: "password" });

    authToken = `Bearer ${loginRes.body.accessToken}`;
    console.log("authToken", authToken);
  });

  afterAll(async () => {
    // Close the database connection
    await AppDataSource.destroy();
  });

  it("should create a new reservation", async () => {
    const res = await request(app)
      .post("/reservations") //
      .set("Authorization", authToken)
      .send({
        name: "John Doe",
        phone: "75906713",
        numberOfPeople: 4,
        tableId: 6,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("reservation");
  });
});

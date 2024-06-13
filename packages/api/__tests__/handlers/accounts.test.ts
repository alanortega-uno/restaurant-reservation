import request from "supertest";
import { DataSource } from "typeorm";

import { StatusCodes } from "http-status-codes";

import { AccountEntity } from "../../src/entities/account";
import { RefreshTokenEntity } from "../../src/entities/refreshToken";
import { ReservationEntity } from "../../src/entities/reservation";
import { TableEntity } from "../../src/entities/table";

import app from "../../index";

describe("Account Endpoint", () => {
  let AppDataSource!: DataSource;

  beforeAll(async () => {
    AppDataSource = new DataSource({
      type: "mariadb",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "Control123",
      database: "restaurant_reservations",
      entities: [
        AccountEntity,
        RefreshTokenEntity,
        ReservationEntity,
        TableEntity,
      ],
      synchronize: true,
    });

    await AppDataSource.initialize();
  });

  describe("Login", () => {
    it("should not be able to log in with an email that does not exist", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "alan.ortega@wrong.com",
        password: "wrong password",
      });

      expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });

    it("should not be able to log in with an empty password", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "alan.ortega@wrong.com",
        password: "",
      });

      expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it("should not be able to log in with a wrong password", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "alan.ortega@gmail.com",
        password: "wrong password",
      });

      expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    });

    it("should be able to login with valid credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "alan.ortega@gmail.com",
        password: "password",
      });

      expect(res.statusCode).toEqual(StatusCodes.OK);
    });
  });
});

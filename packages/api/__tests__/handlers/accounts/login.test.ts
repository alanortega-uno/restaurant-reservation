import request from "supertest";
import { DataSource } from "typeorm";

import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

import { AccountEntity } from "../../../src/entities/account";
import { RefreshTokenEntity } from "../../../src/entities/refreshToken";
import { ReservationEntity } from "../../../src/entities/reservation";
import { TableEntity } from "../../../src/entities/table";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../src/utils/tokens";

import app from "../../../src/index";

// Mock the dependencies
jest.mock("../../../src/entities/refreshToken");
jest.mock("../../../src/entities/account");
jest.mock("../../../src/entities/table");
jest.mock("../../../src/entities/reservation");
jest.mock("bcryptjs");
jest.mock("../../../src/utils/tokens");

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

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("login", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 400 if email or password is missing", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "",
        password: "",
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe("Send email and password");
    });

    it("should return 404 if email is not found", async () => {
      (AccountEntity.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe("Email not found");
    });

    it("should return 401 if password is incorrect", async () => {
      (AccountEntity.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "wrong_password",
      });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).toBe("Wrong Password");
    });

    it("should return 200 and tokens if email and password are correct", async () => {
      (AccountEntity.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        is_admin: false,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateAccessToken as jest.Mock).mockReturnValue("access-token");
      (generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
    });

    it("should return 500 if there is an internal server error", async () => {
      (AccountEntity.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body.message).toBe("Database error");
    });
  });
});

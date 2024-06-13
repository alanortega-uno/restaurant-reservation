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

import app from "../../../index";

// Mock the dependencies
jest.mock("../../../src/entities/refreshToken");
jest.mock("../../../src/entities/account");
jest.mock("../../../src/entities/table");
jest.mock("../../../src/entities/reservation");
jest.mock("bcryptjs");
jest.mock("../../../src/utils/tokens");

describe("createAccount", () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ACCESS_TOKEN_SECRET = "testAccessTokenSecret";
    process.env.REFRESH_TOKEN_SECRET = "testRefreshTokenSecret";
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email or password is missing", async () => {
    const response = await request(app).post("/auth/new-account").send({
      email: "",
      password: "",
    });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Send email and password");
  });

  it("should return 409 if account already exists", async () => {
    (AccountEntity.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
    });

    const response = await request(app).post("/auth/new-account").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(StatusCodes.CONFLICT);
    expect(response.body.message).toBe("Account already exists");
  });

  it("should return 201 and tokens if account is created successfully", async () => {
    (AccountEntity.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (AccountEntity.create as jest.Mock).mockReturnValue({
      save: jest.fn().mockResolvedValue({
        id: 1,
        email: "test@example.com",
        is_admin: false,
      }),
    });
    (generateAccessToken as jest.Mock).mockReturnValue("access-token");
    (generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");

    const response = await request(app).post("/auth/new-account").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  it("should return 500 if there is a server error", async () => {
    (AccountEntity.findOne as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(app).post("/auth/new-account").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body.message).toBe("Internal server error");
  });
});

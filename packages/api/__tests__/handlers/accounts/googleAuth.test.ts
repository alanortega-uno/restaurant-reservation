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

describe("googleAuth", () => {
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

  it("should return 401 if credentials are missing", async () => {
    const response = await request(app).post("/auth/google").send({});

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.message).toBe("Send your credentials");
  });

  it("should return 201 and tokens if account is created successfully", async () => {
    const credentials = Buffer.from(
      JSON.stringify({ email: "test@example.com", sub: "password" })
    ).toString("base64");

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

    const response = await request(app)
      .post("/auth/google")
      .send({
        credentials: `eyJhbGciOiJIUzI1NiJ9.${credentials}.signature`,
      });

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  it("should return 200 and tokens if account exists", async () => {
    const credentials = Buffer.from(
      JSON.stringify({ email: "test@example.com", sub: "password" })
    ).toString("base64");

    (AccountEntity.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
      is_admin: false,
    });
    (generateAccessToken as jest.Mock).mockReturnValue("access-token");
    (generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");

    const response = await request(app)
      .post("/auth/google")
      .send({
        credentials: `eyJhbGciOiJIUzI1NiJ9.${credentials}.signature`,
      });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    const credentials = Buffer.from(
      JSON.stringify({ email: "test@example.com", sub: "password" })
    ).toString("base64");

    (AccountEntity.findOne as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(app)
      .post("/auth/google")
      .send({
        credentials: `eyJhbGciOiJIUzI1NiJ9.${credentials}.signature`,
      });

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body.message).toBe("Database error");
  });
});

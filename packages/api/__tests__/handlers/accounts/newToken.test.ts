import request from "supertest";
import { DataSource } from "typeorm";

import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

import { newToken } from "../../../src/handlers/authentication";

import { RefreshTokenEntity } from "../../../src/entities/refreshToken";
import jwt from "jsonwebtoken";

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
// jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../src/utils/tokens");

describe("newToken", () => {
  let AppDataSource!: DataSource;

  beforeAll(async () => {
    AppDataSource = new DataSource({
      type: "mariadb",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "Control123",
      database: "restaurant_reservations",
      entities: [RefreshTokenEntity],
      synchronize: true,
    });

    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REFRESH_TOKEN_SECRET = "testRefreshTokenSecret";
  });

  it("should return 400 if refresh token is missing", async () => {
    const response = await request(app).post("/auth/token").send({});

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.message).toBe("Send a refresh Token");
  });

  it("should return 403 if token is not valid", async () => {
    (RefreshTokenEntity.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post("/auth/token")
      .send({ token: "invalid-token" });

    expect(response.status).toBe(StatusCodes.FORBIDDEN);
    expect(response.body.message).toBe("Token is not valid");
  });

  it("should return 403 if jwt verification fails", async () => {
    const refreshTokenEntity = {
      token: "valid-token",
    };

    (RefreshTokenEntity.findOne as jest.Mock).mockResolvedValue(
      refreshTokenEntity
    );

    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error("invalid token"), undefined);
    });

    const response = await request(app)
      .post("/auth/token")
      .send({ token: "valid-token" });

    expect(response.status).toBe(StatusCodes.FORBIDDEN);
  });

  it("should return 200 and new access token if refresh token is valid", async () => {
    const refreshTokenEntity = {
      token: "valid-token",
    };
    const account = {
      id: 1,
      email: "test@example.com",
      isAdmin: false,
    };

    (RefreshTokenEntity.findOne as jest.Mock).mockResolvedValue(
      refreshTokenEntity
    );
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, account);
    });
    (generateAccessToken as jest.Mock).mockReturnValue("new-access-token");

    const response = await request(app)
      .post("/auth/token")
      .send({ token: "valid-token" });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual({
      accessToken: "new-access-token",
    });
  });

  it("should return 500 if REFRESH_TOKEN_SECRET is missing", async () => {
    delete process.env.REFRESH_TOKEN_SECRET;

    const refreshTokenEntity = {
      token: "valid-token",
    };
    (RefreshTokenEntity.findOne as jest.Mock).mockResolvedValue(
      refreshTokenEntity
    );

    const response = await request(app)
      .post("/auth/token")
      .send({ token: "valid-token" });

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body.message).toBe("Internal server error");
  });
});

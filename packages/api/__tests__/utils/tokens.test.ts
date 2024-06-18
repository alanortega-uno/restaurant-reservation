import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../src/utils/tokens";
import { RefreshTokenEntity } from "../../src/entities/refreshToken";
import { Account } from "../../src/interfaces/account.interfaces";

jest.mock("jsonwebtoken");
jest.mock("../../src/entities/refreshToken");

describe("[utils] tokens", () => {
  beforeEach(() => {
    process.env.ACCESS_TOKEN_SECRET = "testAccessTokenSecret";
    process.env.REFRESH_TOKEN_SECRET = "testRefreshTokenSecret";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateAccessToken", () => {
    it("should generate an access token", () => {
      const payload = { id: 1, email: "test@example.com" };
      const token = "accessToken";
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = generateAccessToken(payload);

      expect(
        jwt.sign as (
          payload: string | object | Buffer,
          secretOrPrivateKey: jwt.Secret,
          options?: jwt.SignOptions | undefined
        ) => string
      ).toHaveBeenCalledWith(payload, "testAccessTokenSecret", {
        expiresIn: "15s",
      });
      expect(result).toBe(token);
    });

    it("should throw an error if ACCESS_TOKEN_SECRET is not set", () => {
      delete process.env.ACCESS_TOKEN_SECRET;

      expect(() => generateAccessToken({})).toThrow(
        "There is no ACCESS_TOKEN_SECRET"
      );
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a refresh token and save it to the database", async () => {
      const account: Account = {
        id: 1,
        email: "test@example.com",
        isAdmin: false,
      };
      const token = "refreshToken";
      (jwt.sign as jest.Mock).mockReturnValue(token);
      (RefreshTokenEntity.create as jest.Mock).mockReturnValue({
        save: jest.fn().mockResolvedValue(undefined),
      });

      const result = await generateRefreshToken(account);

      expect(
        jwt.sign as (
          payload: string | object | Buffer,
          secretOrPrivateKey: jwt.Secret,
          options?: jwt.SignOptions | undefined
        ) => string
      ).toHaveBeenCalledWith(account, "testRefreshTokenSecret");
      expect(
        RefreshTokenEntity.create<RefreshTokenEntity>
      ).toHaveBeenCalledWith({
        account_id: account.id,
        token,
      });
      expect(result).toBe(token);
    });

    it("should throw an error if REFRESH_TOKEN_SECRET is not set", async () => {
      delete process.env.REFRESH_TOKEN_SECRET;

      try {
        await generateRefreshToken({
          id: 1,
          email: "test@example.com",
          isAdmin: false,
        });
        // If the function does not throw, fail the test
        fail(
          "generateRefreshToken did not throw an error when REFRESH_TOKEN_SECRET was not set"
        );
      } catch (error) {
        expect(error).toEqual(new Error("There is no REFRESH_TOKEN_SECRET"));
      }
    });
  });
});

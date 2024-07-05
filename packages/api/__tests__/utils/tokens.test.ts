import {
  generateAccessToken,
  generateRefreshToken,
} from "../../src/utils/tokens";
import jwt, { SignOptions } from "jsonwebtoken";
import { RefreshTokenEntity } from "../../src/entities/refreshToken";
import { AccountPayload } from "../../src/interfaces/account.interfaces";

jest.mock("jsonwebtoken");
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));
jest.mock("../../src/entities/refreshToken");

describe("Auth Utils", () => {
  beforeEach(() => {
    process.env.ACCESS_TOKEN_SECRET = "test-access-token-secret";
    process.env.REFRESH_TOKEN_SECRET = "test-refresh-token-secret";
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("generateAccessToken", () => {
    it("should generate an access token", () => {
      const payload = { id: 1 };
      const token = "access-token";
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = generateAccessToken(payload);

      expect(result).toBe(token);
    });

    it("should throw an error if ACCESS_TOKEN_SECRET is not defined", () => {
      delete process.env.ACCESS_TOKEN_SECRET;

      expect(() => generateAccessToken({ id: 1 })).toThrow(
        "There is no ACCESS_TOKEN_SECRET"
      );
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a refresh token and save it to the database", async () => {
      const account: AccountPayload = {
        id: 1,
        email: "test@user.com",
        isAdmin: false,
      };
      const token = "refresh-token";
      (jwt.sign as jest.Mock).mockReturnValue(token);
      const saveMock = jest.fn();
      (RefreshTokenEntity.create as jest.Mock).mockReturnValue({
        save: saveMock,
      });

      const result = await generateRefreshToken(account);

      expect(saveMock).toHaveBeenCalled();
      expect(result).toBe(token);
    });

    it("should throw an error if REFRESH_TOKEN_SECRET is not defined", async () => {
      delete process.env.REFRESH_TOKEN_SECRET;

      try {
        await generateRefreshToken({
          id: 1,
          email: "test@user.com",
          isAdmin: false,
        });
      } catch (error) {
        expect(error).toEqual(new Error("There is no REFRESH_TOKEN_SECRET"));
      }
    });
  });
});

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { RefreshTokenEntity } from "../entities/refreshToken";
import { AccountPayload } from "../interfaces/account.interfaces";

export const generateAccessToken = (payload: string | object | Buffer) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("There is no ACCESS_TOKEN_SECRET");
  }

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
};

export const generateRefreshToken = async (account: AccountPayload) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("There is no REFRESH_TOKEN_SECRET");
  }

  const refreshToken = jwt.sign(account, process.env.REFRESH_TOKEN_SECRET);

  const refreshTokenEntity = RefreshTokenEntity.create({
    account_id: account.id,
    token: refreshToken,
  });

  await refreshTokenEntity.save();

  return refreshToken;
};

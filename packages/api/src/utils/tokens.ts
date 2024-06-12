import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { RefreshTokenEntity } from "../entities/refreshToken";
import { Account } from "../interfaces/account.interfaces";
import { AccountEntity } from "../entities/account";

export const generateAccessToken = (payload: string | object | Buffer) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("There is no ACCESS_TOKEN_SECRET");
  }

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
};

export const generateRefreshToken = async (account: Account) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("There is no REFRESH_TOKEN_SECRET");
  }

  const refreshToken = jwt.sign(account, process.env.REFRESH_TOKEN_SECRET);

  const refreshTokenEntity = RefreshTokenEntity.create({
    accountId: account.id,
    token: refreshToken,
  });

  await refreshTokenEntity.save();

  return refreshToken;
};

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { AccountEntity } from "../entities/account";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { Account } from "../interfaces/account.interfaces";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import { RefreshTokenEntity } from "../entities/refreshToken";
dotenv.config();

export const test = (request: Request, response: Response) => {
  response.json({
    message: "test",
  });
};

export const getAllAccounts = async (request: Request, response: Response) => {
  const accounts = await AccountEntity.find();

  response.status(StatusCodes.OK).json({
    accounts,
  });
};

export const createAccount = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      response.status(StatusCodes.BAD_REQUEST).json({
        message: "Send email and password",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccountEntity = AccountEntity.create({
      email,
      password: hashedPassword,
    });

    await newAccountEntity.save();

    const newAccount: Account = {
      id: newAccountEntity.id,
      email: newAccountEntity.email,
      isAdmin: newAccountEntity.is_admin,
    };

    const accessToken = generateAccessToken(newAccount);
    const refreshToken = generateRefreshToken(newAccount);

    response.status(StatusCodes.CREATED).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: JSON.stringify(error),
    });
  }
};

export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    response.status(StatusCodes.BAD_REQUEST).json({
      message: "Send email and password",
    });
    return;
  }

  const account = await AccountEntity.findOne({
    select: {
      id: true,
      email: true,
      password: true,
      is_admin: true,
    },
    where: {
      email,
    },
  });

  if (!account) {
    response.status(StatusCodes.NOT_FOUND).json({
      message: "Email not found",
    });

    return;
  }

  try {
    if (await bcrypt.compare(password, account.password)) {
      const payload: Account = {
        id: account.id,
        email: account.email,
        isAdmin: account.is_admin,
      };

      if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("There is no ACCESS_TOKEN_SECRET");
      }

      if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("There is no REFRESH_TOKEN_SECRET");
      }

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      response.json({
        accessToken,
        refreshToken,
      });
    } else {
      response.status(StatusCodes.UNAUTHORIZED).json({
        message: "Wrong Password",
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).send();
  }
};

export const newToken = async (request: Request, response: Response) => {
  const refreshToken = request.body.token;
  const accountId = request.params.accountId;

  if (!refreshToken) {
    response.status(StatusCodes.BAD_REQUEST).json({
      message: "Send a refresh Token",
    });
    return;
  }

  const refreshTokenEntity = await RefreshTokenEntity.findOne({
    select: {
      token: true,
    },
    where: {
      account_id: +accountId,
    },
  });

  if (!refreshTokenEntity || refreshTokenEntity.token !== refreshToken) {
    response.status(StatusCodes.FORBIDDEN).json({
      message: "Token is not valid",
    });

    return;
  }

  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("There is no REFRESH_TOKEN_SECRET");
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (
      error: jwt.VerifyErrors | null,
      account: string | jwt.JwtPayload | undefined
    ) => {
      if (error) {
        response.sendStatus(StatusCodes.FORBIDDEN);
        return;
      }

      const accessToken = generateAccessToken(account as Account);

      response.status(StatusCodes.OK).json({
        accessToken,
      });
    }
  );
};

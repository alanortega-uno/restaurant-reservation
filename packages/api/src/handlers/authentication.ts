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

// TODO: Remove
export const test = (request: Request, response: Response) => {
  response.json({
    message: "test",
  });
};

// TODO: Remove
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

    const accountExists = await AccountEntity.findOne({
      select: {
        id: true,
        email: true,
        password: true,
      },
      where: {
        email,
      },
    });

    if (accountExists) {
      response.status(StatusCodes.CONFLICT).json({
        message: "Account already exists",
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
    const refreshToken = await generateRefreshToken(newAccount);

    response.status(StatusCodes.CREATED).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
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

  try {
    const account = await AccountEntity.findOne({
      select: {
        id: true,
        email: true,
        password: true,
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
      const refreshToken = await generateRefreshToken(payload);

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
    if (process.env.NODE_ENV !== "test") console.error(error);

    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const googleAuth = async (request: Request, response: Response) => {
  const { credentials } = request.body;

  if (!credentials) {
    response.status(StatusCodes.UNAUTHORIZED).json({
      message: "Send your credentials",
    });

    return;
  }

  try {
    const googleAccount = JSON.parse(atob(credentials.split(".")[1]));

    const email: string = googleAccount.email;
    const password: string = googleAccount.sub;

    const account = await AccountEntity.findOne({
      select: {
        id: true,
        email: true,
        password: true,
      },
      where: {
        email,
      },
    });

    if (!account) {
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
      const refreshToken = await generateRefreshToken(newAccount);

      response.status(StatusCodes.CREATED).json({
        accessToken,
        refreshToken,
      });

      return;
    }

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
    const refreshToken = await generateRefreshToken(payload);

    response.status(StatusCodes.OK).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "test") console.error(error);

    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
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

  try {
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
  } catch (error) {
    if (process.env.NODE_ENV !== "test") console.error(error);

    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

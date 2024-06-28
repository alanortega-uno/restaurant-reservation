import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { AccountEntity } from "../entities/account";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { AccountPayload } from "../interfaces/account.interfaces";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import { RefreshTokenEntity } from "../entities/refreshToken";
import { ServerError } from "../utils/server-error";
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

export const createAccount = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return next(
      new ServerError("Send email and password", StatusCodes.BAD_REQUEST)
    );
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
    return next(
      new ServerError("Account already exists", StatusCodes.CONFLICT)
    );
  }

  // TODO: consider hashing your password in the Entity
  const hashedPassword = await bcrypt.hash(password, 10);

  const newAccountEntity = AccountEntity.create({
    email,
    password: hashedPassword,
  });

  await newAccountEntity.save();

  const newAccount: AccountPayload = {
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
};

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return next(
      new ServerError("Send email and password", StatusCodes.BAD_REQUEST)
    );
  }

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
    return next(new ServerError("Email not found", StatusCodes.NOT_FOUND));
  }

  if (!(await bcrypt.compare(password, account.password))) {
    return next(new ServerError("Wrong Password", StatusCodes.UNAUTHORIZED));
  }

  const payload: AccountPayload = {
    id: account.id,
    email: account.email,
    isAdmin: account.is_admin,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  response.json({
    email: account.email,
    accessToken,
    refreshToken,
  });
};

export const googleAuth = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { credentials } = request.body;

  if (!credentials) {
    return next(
      new ServerError("Send your credentials", StatusCodes.UNAUTHORIZED)
    );
  }

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
    // Create Account
    // TODO: consider hashing your password in the Entity
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccountEntity = AccountEntity.create({
      email,
      password: hashedPassword,
    });

    await newAccountEntity.save();

    const newAccount: AccountPayload = {
      id: newAccountEntity.id,
      email: newAccountEntity.email,
      isAdmin: newAccountEntity.is_admin,
    };

    const accessToken = generateAccessToken(newAccount);
    const refreshToken = await generateRefreshToken(newAccount);

    response.status(StatusCodes.CREATED).json({
      email,
      accessToken,
      refreshToken,
    });

    return;
  }

  const payload: AccountPayload = {
    id: account.id,
    email: account.email,
    isAdmin: account.is_admin,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  response.status(StatusCodes.OK).json({
    email: account.email,
    accessToken,
    refreshToken,
  });
};

export const newToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const refreshToken = request.body.token;
  const accountId = request.params.accountId;

  if (!refreshToken) {
    return next(
      new ServerError("Send a refresh Token", StatusCodes.BAD_REQUEST)
    );
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
    return next(new ServerError("Token is not valid", StatusCodes.FORBIDDEN));
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
        return next(new ServerError("Invalid token", StatusCodes.FORBIDDEN));
      }

      const accessToken = generateAccessToken(account as AccountPayload);

      response.status(StatusCodes.OK).json({
        accessToken,
      });
    }
  );
};

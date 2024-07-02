import { Response, NextFunction, Request } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import { RequestWithAccount } from "../interfaces/request.interfaces";
import { AccountPayload } from "../interfaces/account.interfaces";

import { ServerError } from "../utils/server-error";
import { AccountEntity } from "../entities/account";

export const authorizeToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return next(new ServerError("There is no token", StatusCodes.UNAUTHORIZED));
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    return next(new ServerError("There is no ACCESS_TOKEN_SECRET"));
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, accountData) => {
      if (error) {
        return next(new ServerError("Invalid Token", StatusCodes.FORBIDDEN));
      }

      const account = await AccountEntity.findOne({
        where: { id: (accountData as AccountPayload).id },
      });

      if (!account) {
        return next(
          new ServerError("Account not found", StatusCodes.NOT_FOUND)
        );
      }

      (request as RequestWithAccount).account = account;

      next();
    }
  );
};

export const isAdminAccount = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const account = (request as RequestWithAccount).account;

  if (!account) {
    return next(
      new ServerError("There is no account", StatusCodes.UNAUTHORIZED)
    );
  }

  if (!account.is_admin) {
    return next(
      new ServerError("Account is not admin", StatusCodes.UNAUTHORIZED)
    );
  }

  next();
};

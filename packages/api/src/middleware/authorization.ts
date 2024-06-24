import { Response, NextFunction, Request } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import { RequestWithAccount } from "../interfaces/request.interfaces";
import { Account } from "../interfaces/account.interfaces";

import { ServerError } from "../utils/server-error";

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

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, account) => {
    if (error) {
      return next(new ServerError("Invalid Token", StatusCodes.FORBIDDEN));
    }

    (request as RequestWithAccount).account = account as Account;

    next();
  });
};

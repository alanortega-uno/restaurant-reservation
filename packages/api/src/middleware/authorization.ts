import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { AccountRequest } from "../interfaces/request.interfaces";
import { Account } from "../interfaces/account.interfaces";
dotenv.config();

export const authorizeToken = (
  request: AccountRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      response.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("There is no ACCESS_TOKEN_SECRET");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, account) => {
      if (error) {
        response.sendStatus(StatusCodes.FORBIDDEN);
        return;
      }

      request.account = account as Account;

      next();
    });
  } catch (error) {
    console.error(error);
    response.status(500).send();
  }
};

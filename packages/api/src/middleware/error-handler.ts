import { NextFunction, Request, Response } from "express";
import { getReasonPhrase } from "http-status-codes";

export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode ?? 500;

  response
    .status(error.statusCode)
    .json({ message: error.message ?? getReasonPhrase(error.statusCode) });
};

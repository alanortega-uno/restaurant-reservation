import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import dotenv from "dotenv";
import { TableEntity } from "../entities/table";
dotenv.config();

export const getAllTables = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const tables = await TableEntity.find();

  response.status(StatusCodes.OK).json({
    tables,
  });
};

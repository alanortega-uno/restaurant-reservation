import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import dotenv from "dotenv";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";
dotenv.config();

const exec = promisify(execCb);

export const resetDB = async (request: Request, response: Response) => {
  await exec("npm run e2e:reset:db");

  response.sendStatus(StatusCodes.OK);
};

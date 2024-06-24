import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import dotenv from "dotenv";
import { TableEntity } from "../entities/table";
import { ReservationEntity } from "../entities/reservation";
import { RequestWithAccount } from "../interfaces/request.interfaces";
import { AccountEntity } from "../entities/account";
import { ServerError } from "../utils/server-error";
import { validate } from "class-validator";
dotenv.config();

export const createReservation = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { name, phone, numberOfPeople, tableId } = request.body;

  const accountId = (request as RequestWithAccount).account.id;
  const account = await AccountEntity.findOne({
    where: { id: accountId },
  });

  if (!account) {
    return next(new ServerError("Account not found", StatusCodes.NOT_FOUND));
  }

  const table = await TableEntity.findOne({
    where: { id: tableId },
  });

  if (!table) {
    return next(new ServerError("Table not found", StatusCodes.NOT_FOUND));
  }

  if (numberOfPeople > table.capacity) {
    return next(
      new ServerError("Table capacity exceeded", StatusCodes.BAD_REQUEST)
    );
  }

  const newReservation = await ReservationEntity.create({
    name: name as string,
    phone: phone as string,
    number_of_people: +numberOfPeople,
    account,
    table,
  });

  const validationErrors = await validate(newReservation);

  if (validationErrors.length > 0) {
    return next(new ServerError("Validation errors", StatusCodes.BAD_REQUEST));
  }

  await newReservation.save();

  response.sendStatus(StatusCodes.CREATED);
};

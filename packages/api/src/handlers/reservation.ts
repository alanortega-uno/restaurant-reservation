import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import dotenv from "dotenv";
dotenv.config();

import { TableEntity } from "../entities/table";
import { ReservationEntity } from "../entities/reservation";
import { RequestWithAccount } from "../interfaces/request.interfaces";
import { ServerError } from "../utils/server-error";
import { validate } from "class-validator";

import { ReservationService } from "../services/reservation";
import {
  Reservation,
  ReservationStatus,
  SocketEvents,
} from "@restaurant-reservation/shared";

import { io } from "../index";

export const getReservation = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const reservation = await ReservationService.getLastReservation(
    (request as RequestWithAccount).account.id
  );

  const activeReservation = {
    id: reservation?.id,
    name: reservation?.name,
    numberOfPeople: reservation?.number_of_people,
    phone: reservation?.phone,
    status: reservation?.status,
    createdAt: reservation?.created_at,
    updatedAt: reservation?.updated_at,
    table: reservation?.table,
    account: { ...reservation?.account, password: undefined },
  };

  response.status(StatusCodes.OK).json({
    activeReservation:
      activeReservation.status === ReservationStatus.active
        ? activeReservation
        : null,
  });
};

export const createReservation = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { name, phone, numberOfPeople, tableId } = request.body;

  const table = await TableEntity.findOne({
    where: { id: tableId },
  });

  if (!table) {
    return next(new ServerError("Table not found", StatusCodes.NOT_FOUND));
  }

  if (table.status !== 0) {
    return next(
      new ServerError("Table is not available", StatusCodes.CONFLICT)
    );
  }

  if (numberOfPeople > table.capacity) {
    return next(
      new ServerError("Table capacity exceeded", StatusCodes.BAD_REQUEST)
    );
  }

  const newReservation = await ReservationService.createReservation({
    name: name as string,
    phone: phone as string,
    number_of_people: +numberOfPeople,
    account: (request as RequestWithAccount).account,
    table,
  });

  const validationErrors = await validate(newReservation);

  if (validationErrors.length > 0) {
    const message = Object.values(validationErrors[0].constraints as Object)[0];
    return next(new ServerError(message, StatusCodes.BAD_REQUEST));
  }

  await newReservation.save();

  io.emit(SocketEvents.updateTables);
  response.status(StatusCodes.CREATED).json({
    message: "Reservation created",
    reservation: newReservation,
  });
};

export const cancelReservation = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const reservationId = parseInt(request.params.id, 10);

  if (isNaN(reservationId)) {
    return void response
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid reservation ID" });
  }

  await ReservationService.cancelReservation(reservationId);

  io.emit(SocketEvents.updateTables);
  response.status(StatusCodes.OK).json({
    message: "Reservation cancelled",
  });
};

export const updateReservation = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const reservationId = parseInt(request.params.id, 10);
  if (isNaN(reservationId)) {
    return void response
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid reservation ID" });
  }

  const { name, phone, numberOfPeople } = request.body;

  const reservationEntity = await ReservationService.updateReservation(
    reservationId,
    name,
    phone,
    numberOfPeople
  );

  const reservation = {
    id: reservationEntity?.id,
    name: reservationEntity?.name,
    numberOfPeople: reservationEntity?.number_of_people,
    phone: reservationEntity?.phone,
    status: reservationEntity?.status,
    createdAt: reservationEntity?.created_at,
    updatedAt: reservationEntity?.updated_at,
    table: reservationEntity?.table,
    account: reservationEntity?.account,
  };

  response.status(StatusCodes.OK).json({ reservation });
};

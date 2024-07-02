import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import dotenv from "dotenv";
dotenv.config();

import { TableEntity } from "../entities/table";
import { ServerError } from "../utils/server-error";
import {
  ReservationStatus,
  TableEntityData,
  TableStatus,
  SocketEvents,
} from "../../../shared/index";

import { io } from "../index";
import { ReservationService } from "../services/reservation";

import { RequestWithAccount } from "../interfaces/request.interfaces";

export const updateTableStatus = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const table: TableEntityData = request.body.table;
  const reservationForm: {
    name: string;
    phone: string;
    numberOfPeople: number;
  } = request.body.reservation;

  const tableEntity = await TableEntity.findOne({
    where: {
      id: table.id,
    },
  });

  if (!tableEntity) {
    return next(
      new ServerError(
        "There is no TableEntity for the ID",
        StatusCodes.BAD_REQUEST
      )
    );
  }

  if (table.status === TableStatus.occupied) {
    await tableStatusToOccupied(tableEntity, response);
  } else if (table.status === TableStatus.available) {
    await tableStatusToAvailable(tableEntity, response);
  } else if (table.status === TableStatus.reserved) {
    await tableStatusToReserved(
      tableEntity,
      reservationForm,
      request,
      response
    );
  }
};

const tableStatusToOccupied = async (
  tableEntity: TableEntity,
  response: Response
) => {
  const reservation = await ReservationService.getLastReservationByTable(
    tableEntity.id
  );

  if (reservation && reservation.status === ReservationStatus.active) {
    await ReservationService.fulfillReservation(reservation.id);

    const table = await TableEntity.findOne({
      where: {
        id: tableEntity.id,
      },
    });

    response.status(StatusCodes.OK).json({
      table,
    });
    io.emit(SocketEvents.updateTablesAndReservation);
  } else {
    tableEntity.status = TableStatus.occupied;

    await tableEntity.save();

    response.status(StatusCodes.OK).json({
      table: tableEntity,
    });
    io.emit(SocketEvents.updateTables, { tableId: tableEntity.id });
  }
};

const tableStatusToAvailable = async (
  tableEntity: TableEntity,
  response: Response
) => {
  const reservation = await ReservationService.getLastReservationByTable(
    tableEntity.id
  );

  if (reservation && reservation.status === ReservationStatus.active) {
    await ReservationService.cancelReservation(reservation.id);

    const table = await TableEntity.findOne({
      where: {
        id: tableEntity.id,
      },
    });

    response.status(StatusCodes.OK).json({
      table,
    });
    io.emit(SocketEvents.updateTablesAndReservation);
  } else {
    tableEntity.status = TableStatus.available;

    await tableEntity.save();

    response.status(StatusCodes.OK).json({
      table: tableEntity,
    });
    io.emit(SocketEvents.updateTables, { tableId: tableEntity.id });
  }
};

const tableStatusToReserved = async (
  tableEntity: TableEntity,
  reservationForm: {
    name: string;
    phone: string;
    numberOfPeople: number;
  },
  request: Request,
  response: Response
) => {
  const reservation = await ReservationService.getLastReservationByTable(
    tableEntity.id
  );

  console.log("reservation", reservation);
  console.log("reservationForm", reservationForm);

  if (reservation && reservation.status === ReservationStatus.active) {
    // update reservation
    await ReservationService.updateReservation(
      reservation.id,
      reservationForm.name,
      reservationForm.phone,
      reservationForm.numberOfPeople
    );
  } else {
    // create
    await ReservationService.createReservation({
      name: reservationForm.name as string,
      phone: reservationForm.phone as string,
      number_of_people: +reservationForm.numberOfPeople,
      account: (request as RequestWithAccount).account,
      table: tableEntity,
    });
  }

  io.emit(SocketEvents.updateTables, {
    TableEntityData: tableEntity.id,
  });

  response.status(StatusCodes.OK).json({
    message: "OK",
  });
};

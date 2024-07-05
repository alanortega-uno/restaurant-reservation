import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  getReservationCountsGroupedByCustomRange,
  getThisMonthReservationCountsGroupedByWeek,
  getThisWeekReservationCounts,
} from "../queries/statistics";
import { ServerError } from "../utils/server-error";

export const getThisWeekReservationData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const thisWeekReservationCounts = await getThisWeekReservationCounts();
  const matrix = dataThisWeekToMatrix(thisWeekReservationCounts, [
    "day",
    "total",
    "fulfilled",
    "cancelled",
  ]);

  response.status(StatusCodes.OK).json({
    data: thisWeekReservationCounts,
    matrix,
  });
};

export const getThisMonthReservationData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const thisMonthReservationCounts =
    await getThisMonthReservationCountsGroupedByWeek();
  const matrix = dataThisMonthToMatrix(thisMonthReservationCounts, [
    "week",
    "total",
    "fulfilled",
    "cancelled",
  ]);

  response.status(StatusCodes.OK).json({
    data: thisMonthReservationCounts,
    matrix,
  });
};

export const getReservationCustomRangeData = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { startDate, endDate } = request.params;

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return next(new ServerError("Invalid dates", StatusCodes.BAD_REQUEST));
  }

  const { result: customRangeReservationCounts, rawResult } =
    await getReservationCountsGroupedByCustomRange(startDate, endDate);
  const matrix = dataThisMonthToMatrix(customRangeReservationCounts, [
    "period",
    "total",
    "fulfilled",
    "cancelled",
  ]);

  response.status(StatusCodes.OK).json({
    data: customRangeReservationCounts,
    matrix,
    rawResult,
  });
};

const dataThisWeekToMatrix = (data: {}, headers: string[]) => {
  const matrix: any[][] = [headers];

  Object.keys(data).forEach((key) => {
    const { cancelled, active, fulfilled } = data[key as keyof Object] as any;
    const total = +cancelled + active + fulfilled;
    const row = [key, total, fulfilled, cancelled];
    matrix.push(row);
  });

  return matrix;
};

const dataThisMonthToMatrix = (data: {}, headers: string[]) => {
  const matrix: any[][] = [headers];

  Object.keys(data).forEach((key) => {
    const { cancelled, fulfilled, total } = data[key as keyof Object] as any;
    const row = [key, total, fulfilled, cancelled];
    matrix.push(row);
  });

  return matrix;
};

const isValidDate = (date: string) => {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!date.match(regEx)) return false; // Invalid format
  var d = new Date(date);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === date;
};

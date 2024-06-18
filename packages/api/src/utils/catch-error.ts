import { NextFunction, Request, Response } from "express";

export const catchAsyncErrors = (
  middleware: (
    request: Request,
    response: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      await middleware(request, response, next);
    } catch (error) {
      next(error);
    }
  };
};

export const catchSyncErrors = (
  middleware: (request: Request, response: Response, next: NextFunction) => void
) => {
  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      middleware(request, response, next);
    } catch (error) {
      next(error);
    }
  };
};

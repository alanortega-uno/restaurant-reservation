import { Request, Response } from "express-serve-static-core";

export const mockRequest = {} as Request;
export const mockResponse = {
  status: jest.fn((_) => this),
  json: jest.fn(),
} as unknown as Response;

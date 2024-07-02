import { ApiError } from "../../../shared/index";

export class ServerError implements ApiError {
  message: string;
  name: string;
  statusCode: number;
  status: string;
  stack?: string;

  constructor(message: string, statusCode = 500, status = "error") {
    this.statusCode = statusCode;
    this.message = message || "";
    this.name = "Error";

    this.status = status;
    // Capture the stack trace (non-standard, V8-specific)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
  }
}

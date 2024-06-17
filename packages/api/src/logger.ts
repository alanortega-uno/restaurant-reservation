import { createLogger, format, transports } from "winston";
import { errorLogger } from "express-winston";

export const logger = createLogger({
  transports: [
    new transports.File({
      level: "warn",
      filename: "warnings.log",
      dirname: "./logs",
    }),
    new transports.File({
      level: "error",
      filename: "errors.log",
      dirname: "./logs",
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.prettyPrint()
  ),
});

const internalErrorLogFormat = format.printf(({ level, meta, timestamp }) => {
  return `${timestamp} ${level}: ${meta.message}`;
});

export const internalErrorLogger = errorLogger({
  transports: [
    new transports.File({
      filename: "internal-errors.log",
      dirname: "./logs",
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    internalErrorLogFormat
  ),
});

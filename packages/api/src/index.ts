import express, { Express, Request, Response } from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import { routes } from "./routes";

import { DataSource } from "typeorm";
import { AccountEntity } from "./entities/account";
import { RefreshTokenEntity } from "./entities/refreshToken";
import { ReservationEntity } from "./entities/reservation";
import { TableEntity } from "./entities/table";

import expressWinston from "express-winston";
import { logger, internalErrorLogger } from "./logger";

const app: Express = express();

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN_1 ?? "http://localhost:4200",
  process.env.ALLOWED_ORIGIN_2 ?? "http://localhost:4200",
];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);
app.use(cors(corsOptions));
app.use(express.json());

const main = async () => {
  try {
    const AppDataSource = new DataSource({
      type: (process.env.DB_TYPE as "mariadb" | "mysql") ?? "mariadb",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        AccountEntity,
        RefreshTokenEntity,
        ReservationEntity,
        TableEntity,
      ],
      synchronize: true,
    });

    await AppDataSource.initialize();

    console.info("[database]: Data Source has been initialized");

    const port = process.env.PORT || 4000;

    // routes
    app.use("/", routes);

    app.use(internalErrorLogger);

    if (process.env.NODE_ENV === "test") return;

    app.listen(port, () => {
      console.info(`[server]: Server is running at port ${port}`);
    });
  } catch (error) {
    console.error(error);
    throw new Error("[server]: Unable to initialize");
  }
};

main();

export default app;

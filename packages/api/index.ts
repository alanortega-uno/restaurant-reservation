import express, { Express, Request, Response } from "express";
import cors from "cors";

import { routes } from "./routes";

import dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";
import { AccountEntity } from "./src/entities/account";
import { RefreshTokenEntity } from "./src/entities/refreshToken";
import { ReservationEntity } from "./src/entities/reservation";
import { TableEntity } from "./src/entities/table";

const app: Express = express();

const allowedOrigins = [
  "http://localhost:4200",
  "http://BOL-MC-240604D.local:3000",
];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(corsOptions));
app.use(express.json());

const main = async () => {
  try {
    const AppDataSource = new DataSource({
      type: "mariadb",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "Control123",
      database: "restaurant_reservations",
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

    if (process.env.NODE_ENV === "test") return;

    app.listen(port, () => {
      console.info(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    throw new Error("[server]: Unable to initialize");
  }
};

main();

export default app;

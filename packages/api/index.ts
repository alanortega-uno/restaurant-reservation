import express, { Express, Request, Response } from "express";

import { routes } from "./routes";

import dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";
import { AccountEntity } from "./src/entities/account";
import { RefreshTokenEntity } from "./src/entities/refreshToken";

const app: Express = express();

const main = async () => {
  try {
    const AppDataSource = new DataSource({
      type: "mariadb",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "Control123",
      database: "restaurant_reservations",
      entities: [AccountEntity, RefreshTokenEntity],
      synchronize: true,
    });

    await AppDataSource.initialize();

    console.info("[database]: Data Source has been initialized");

    app.use(express.json());

    const port = process.env.PORT || 4000;

    // routes
    app.use("/", routes);

    app.listen(port, () => {
      console.info(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    throw new Error("[server]: Unable to initialize");
  }
};

main();

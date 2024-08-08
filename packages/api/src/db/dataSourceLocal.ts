import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

import dotenv from "dotenv";
import { AccountEntity } from "../entities/account";
import { RefreshTokenEntity } from "../entities/refreshToken";
import { ReservationEntity } from "../entities/reservation";
import { TableEntity } from "../entities/table";
import { InitialMigration1722439928348 } from "./migrations/1722439928348-initial-migration";
let envFileName = ".env";
if (process.env.NODE_ENV === "e2e") envFileName = `.env.e2e`;

dotenv.config({ path: envFileName });

let connectionOptions: DataSourceOptions = {
  type: (process.env.DB_TYPE as "mariadb" | "mysql") ?? "mariadb",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [AccountEntity, RefreshTokenEntity, ReservationEntity, TableEntity],
  migrations: [InitialMigration1722439928348],
};

export default new DataSource({
  ...connectionOptions,
});

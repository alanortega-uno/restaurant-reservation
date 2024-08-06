import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

import dotenv from "dotenv";
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
  entities: ["src/entities/*{.ts,.js}"],
  migrations: ["src/db/migrations/*{.ts,.js}"],
};

export default new DataSource({
  ...connectionOptions,
});

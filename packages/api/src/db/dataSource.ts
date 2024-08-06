import DataSourceProd from "./dataSourceProd";
import DataSourceLocal from "./dataSourceLocal";

console.info("Using database: ", process.env.DB_NAME);

export default process.env.NODE_ENV === "production"
  ? DataSourceProd
  : DataSourceLocal;

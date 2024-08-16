import express from "express";
import { authRouter } from "./routes/authentication";
import { tablesRouter } from "./routes/table";
import { defaultRoute } from "./routes/default";
import { reservationsRouter } from "./routes/reservation";
import { tableStatusRouter } from "./routes/tableStatus";
import { statisticsRouter } from "./routes/statistics";
import { e2eRouter } from "./routes/e2e";

export const routes = express.Router();

routes.use(defaultRoute);

routes.use("/auth", authRouter);
routes.use("/tables", tablesRouter);
routes.use("/reservations", reservationsRouter);
routes.use("/table-status", tableStatusRouter);
routes.use("/statistics", statisticsRouter);

if (process.env.NODE_ENV === "e2e") {
  routes.use("/e2e", e2eRouter);
}

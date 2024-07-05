import express from "express";
import { authRouter } from "./routes/authentication";
import { tablesRouter } from "./routes/table";
import { defaultRoute } from "./routes/default";
import { reservationsRouter } from "./routes/reservation";
import { tableStatusRouter } from "./routes/tableStatus";
import { statisticsRouter } from "./routes/statistics";

export const routes = express.Router();

routes.use(defaultRoute);
routes.use("/auth", authRouter);
routes.use("/tables", tablesRouter);
routes.use("/reservations", reservationsRouter);
routes.use("/table-status", tableStatusRouter);
routes.use("/statistics", statisticsRouter);

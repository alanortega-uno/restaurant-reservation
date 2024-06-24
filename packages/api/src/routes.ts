import express from "express";
import { authRouter } from "./routes/authentication";
import { tablesRouter } from "./routes/table";
import { defaultRoute } from "./routes/default";
import { reservationsRouter } from "./routes/reservation";

export const routes = express.Router();

routes.use(defaultRoute);
routes.use("/auth", authRouter);
routes.use("/tables", tablesRouter);
routes.use("/reservations", reservationsRouter);

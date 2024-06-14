import express from "express";
import { authRouter } from "./routes/authentication";
import { defaultRoute } from "./routes/default";

export const routes = express.Router();

routes.use(defaultRoute);
routes.use("/auth", authRouter);

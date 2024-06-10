import express from "express";
import { userRouter } from "./src/routes/users";
import { defaultRoute } from "./src/routes/default";

export const routes = express.Router();

routes.use(defaultRoute);
routes.use("/users", userRouter);

import "reflect-metadata";

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import dotenv from "dotenv";
dotenv.config();

import { routes } from "./routes";

import expressWinston from "express-winston";
import { logger, internalErrorLogger } from "./logger";

import { errorHandler } from "./middleware/error-handler";

import swaggerDocs from "./utils/swagger";

import AppDataSource from "./db/dataSource";

const app: Express = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGIN_1 ?? "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("message", "update your tables");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN_1 ?? "http://localhost:4200",
  process.env.ALLOWED_ORIGIN_2 ?? "http://localhost:4200",
];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);
app.use(cors(corsOptions));
app.use(express.json());

export { AppDataSource };

const main = async () => {
  try {
    await AppDataSource.initialize();

    console.info("[database]: Data Source has been initialized");

    const port = Number(process.env.PORT) || 4000;

    // routes
    app.use("/api", routes);

    app.use(internalErrorLogger);

    app.use(errorHandler);

    swaggerDocs(app, port);

    if (process.env.NODE_ENV === "test") return;

    httpServer.listen(port, () => {
      console.log(`[server]: Server is running at port ${port}`);
    });
  } catch (error) {
    console.error(error);
    throw new Error("[server]: Unable to initialize");
  }
};

main();

export default app;

import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import express from "express";
import "dotenv/config";

import routes from "./routes.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

class App {
  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {},
    });
    this.configureSocket();
    this.configureApp();
    this.middlewares();
    this.routes();
  }

  configureApp() {
    this.app.use((req, res, next) => {
      const allowedOrigins = [
        "https://chatbotdevclub.netlify.app",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "http://localhost:3001",
      ];

      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
      }

      res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, OPTIONS, DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Credentials", true);
      next();
    });

    this.app.use(express.urlencoded({ extended: true, limit: "3mb" }));

    this.app.use((req, res, next) => {
      console.log(
        `Received ${req.method} request for ${
          req.url
        }. Current process memory usage: ${JSON.stringify(
          process.memoryUsage()
        )} bytes.`
      );
      next();
    });
  }

  middlewares() {
    this.app.use(express.json({ limit: "3mb" }));
  }

  routes() {
    this.app.use("/api", routes);
    this.app.use(errorHandler);
  }

  configureSocket() {
    this.io.on("connection", (socket) => {
      // console.log("Um usuário conectou", socket.id);
      // socket.on("disconnect", () => {
      //   console.log("Usuário desconectou", socket.id);
      // });
    });
  }
}

const appInstance = new App();
const httpServer = appInstance.httpServer;
const io = appInstance.io;

httpServer.listen(process.env.PORT || 3001, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);

export { io };

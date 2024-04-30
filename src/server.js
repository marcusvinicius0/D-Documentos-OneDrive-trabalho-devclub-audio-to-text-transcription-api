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
      cors: {
        origin: ["http://localhost:3000", "https://chatbotdevclub.netlify.app/", "https://chatbotclub.com.br", "https://chatbotclub.netlify.app"],

        handlePreflightRequest: (req, res) => {
          res.writeHead(200, {
            "Access-Control-Allow-Origin": "https://chatbotclub.com.br",
            "Access-Control-Allow-Methods": [
              "GET",
              "POST",
              "PUT",
              "PATCH",
              "DELETE",
            ],
          });
          res.end();
        },
      },
    });
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", ["POST", "GET", "PUT", "PATCH", "OPTIONS", "DELETE"]);
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
      next();
    })
    this.configureSocket();
    this.configureApp();
    this.middlewares();
    this.routes();
  }

  configureApp() {
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
    this.io.on("connection", (socket) => {});
  }
}

const appInstance = new App();
const httpServer = appInstance.httpServer;
const io = appInstance.io;

httpServer.listen(process.env.PORT || 3001, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);

export { io };

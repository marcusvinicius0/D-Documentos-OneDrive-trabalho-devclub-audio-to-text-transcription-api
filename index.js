import express from "express";
import routes from "./routes.js";
import "dotenv/config";
class App {
  constructor() {
    this.app = express();
    this.app.use((req, res, next) => {
      const origin = 'https://devclub-audiotranscription.netlify.app';
      res.header(
        'Access-Control-Allow-Methods',
        'POST, GET, PUT, PATCH, OPTIONS, DELETE',
      );
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Acces-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Origin', origin);
      next();
    });
    this.app.use(express.urlencoded({ extended: true, limit: '3mb' }));

    this.middlewares();
    this.routes();
    // this.app.use(errorHandler);
  }

  middlewares() {
    this.app.use(express.json({ limit: '3mb'}));
  }

  routes() {
    this.app.use(routes);
  }
}

const app = new App().app;

app.listen(process.env.PORT || 3001, () => console.log(`Listening on port ${process.env.PORT}`));

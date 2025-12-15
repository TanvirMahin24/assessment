import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { ErrorHandler } from "./middleware/errorHandler";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
      })
    );

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));


    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again later.",
    });
    this.app.use("/api/", limiter);

    // Request logging (in development)
    if (process.env.NODE_ENV === "development") {
      this.app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
      });
    }
  }

  private initializeRoutes(): void {
    this.app.use("/api", routes);
  }

  private initializeErrorHandling(): void {
    this.app.use(ErrorHandler.handle);
  }
}

export default App;

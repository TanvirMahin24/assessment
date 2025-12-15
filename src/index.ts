import dotenv from "dotenv";
import App from "./app";
import env from "./config/env";
import Database from "./config/database";
import RedisClient from "./config/redis";

// Load environment variables
dotenv.config();

const app = new App().app;

const PORT = parseInt(env.PORT, 10);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    console.log("HTTP server closed");

    try {
      await Database.disconnect();
      console.log("Database disconnected");
      const redisInstance = RedisClient.getInstance();
      await redisInstance.disconnect();
      console.log("Redis disconnected");

      console.log("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

export default server;

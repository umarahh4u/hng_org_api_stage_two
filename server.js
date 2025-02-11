// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 😐 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

mongoose.mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB Connection Successfull"));

// 4) START SERVER
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App runnung on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLER REJECTION! 😐 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED, Shutting down gracefully");
  server.close(() => {
    console.log("🕯 Process terminated");
  });
});

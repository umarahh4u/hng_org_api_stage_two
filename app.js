/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const organisationRouter = require("./routes/organisationRoutes");

const app = express();

app.enable("trust proxy");

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());

app.options("*", cors());

// SET Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// To use middleware
// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

app.use("/", (req, res) => {
  res.json({
    statusCode: 200,
    message: "Welcome to the User Authentication and Organisation API",
    endpoints: JSON.parse(
      '{ "/auth/register": "POST - Register a new user","/auth/login": "POST - Log in a user","/api/users/:id": "GET - Get user details [PROTECTED]","/api/organisations": "POST - Create a new organisation [PROTECTED]", "/api/organisations/:orgId":"GET - Get a single organisation record [PROTECTED]","/api/organisations/:orgId/users":"POST - Add a user to an organisation [PROTECTED]"}'
    ),
  });
});

app.use("/", userRouter);
app.use("/api/organisations", organisationRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

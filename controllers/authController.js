/* eslint-disable import/no-extraneous-dependencies */
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Organisation = require("../models/organisationModel");
const { createSendToken } = require("./handlerFactory");

exports.signup = catchAsync(async (req, res, next) => {
  // Check if the user already exists
  const email = req.body.email;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  if (newUser.firstName) {
    const organisation = await Organisation.create({
      name: `${newUser.firstName} Organisation`,
      description: "organisation descriptions is clearly stated",
      users: [newUser._id],
    });

    // Associate the user with the organization
    newUser.organisations.push(organisation._id);
    await newUser.save();

    return createSendToken(newUser, 201, req, res, "Registration successful");
  }

  res.status(400).json({
    status: "Bad request",
    message: "Registration unsuccessful",
    statusCode: 400,
  });

  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    // return next(new AppError("Please provide email and password", 400));
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  // 2) check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    // return next(new AppError("Incorect email or password", 401));
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }
  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res, "Login successful");

  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    // return next(
    //   new AppError("You are not logged in! please login to get access", 401)
    // );

    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  // 2) verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    // return next(
    //   new AppError("The user belonging to this token no longer exist", 401)
    // );

    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  // Grand Access to protected route
  req.user = currentUser;
  next();
});

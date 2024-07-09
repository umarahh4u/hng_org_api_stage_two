const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    // if (popOptions) query = query.populate(popOptions);
    const data = await query;

    if (!data) {
      return next(new AppError("No document found with that ID", 404));
    }

    data.organisations = undefined;
    data.__v = undefined;

    res.status(200).json({
      status: "success",
      message: "User record retrived successful",
      data,
    });

    next();
  });

exports.getAllOrg = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)

    const id = req.user._id;
    let query = Model.find({ users: id });
    // if (popOptions) query = query.populate(popOptions);
    const organisations = await query;

    if (!organisations) {
      return next(new AppError("No document found with that ID", 404));
    }

    organisations.map((org) => (org.users = undefined));
    organisations.map((org) => (org.__v = undefined));

    res.status(200).json({
      status: "success",
      message: "<Organisations record belong to current user>",
      data: {
        organisations,
      },
    });

    next();
  });

exports.getOneOrg = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { orgId } = req.params;
    const userId = req.user._id;

    let org = await Model.findById(orgId);

    if (!org.users.includes(userId)) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You do not belong to this organization",
      });
    }

    // if (popOptions) query = query.populate(popOptions);
    const data = await org;

    if (!data) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You do not belong to this organization",
      });
    }

    data.__v = undefined;
    data.users = undefined;

    res.status(200).json({
      status: "success",
      message: "User record retrived successful",
      data,
    });

    next();
  });

exports.createOneOrg = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
    const userId = req.user._id;

    const organisation = await Model.create({
      name: name,
      description: description,
      users: [userId],
    });

    // Associate the organization with the user
    const user = await User.findById(userId);
    user.organisations.push(organisation._id);
    await user.save();

    const data = organisation;

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data,
    });

    if (!data) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Client error",
        statusCode: 400,
      });
    }

    next();
  });

exports.addUserToOrg = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { userId } = req.body;
    const { orgId } = req.params;

    // Find the user and organization
    const user = await User.findById(userId);
    const organisation = await Model.findById(orgId);

    if (!user || !organisation) {
      return res.status(404).json({ error: "User or Organization not found" });
    }

    // Check if the user is already in the organization
    if (organisation.users.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User is already a member of this organization" });
    }

    // Add the user to the organization
    organisation.users.push(userId);
    await organisation.save();

    // Add the organization to the user's list of organizations
    user.organisations.push(orgId);
    await user.save();

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });

    next();
  });

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.createSendToken = (user, statusCode, req, res, msg) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.header("x-forwarded-proto") === "https" || "http",
  });

  // Remove password from output
  // console.log('user', user);
  user.password = undefined;
  user.__v = undefined;
  user.organisations = undefined;

  res.status(statusCode).json({
    status: "success",
    message: msg,
    data: {
      accessToken: token,
      user,
    },
  });
};

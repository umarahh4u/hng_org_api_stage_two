const User = require("../models/userModel");
const { getOne } = require("./handlerFactory");

exports.getUser = getOne(User);

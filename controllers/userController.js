const User = require("../models/userModel");
const { getOne } = require("./handlerFactory");

exports.getUser = getOne(User);

exports.getDefault = (req, res) => {
  res.json({
    statusCode: 200,
    message: "Welcome to the User Authentication and Organisation API",
    endpoints: JSON.parse(
      '{ "/auth/register": "POST - Register a new user","/auth/login": "POST - Log in a user","/api/users/:id": "GET - Get user details [PROTECTED]","/api/organisations": "POST - Create a new organisation [PROTECTED]", "/api/organisations/:orgId":"GET - Get a single organisation record [PROTECTED]","/api/organisations/:orgId/users":"POST - Add a user to an organisation [PROTECTED]"}'
    ),
  });
};

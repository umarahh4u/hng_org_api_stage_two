const Organisation = require("../models/organisationModel");
const {
  getAllOrg,
  getOneOrg,
  createOneOrg,
  addUserToOrg,
} = require("./handlerFactory");

exports.getAllOrganisations = getAllOrg(Organisation);
exports.getOrganisations = getOneOrg(Organisation);
exports.createOrganisation = createOneOrg(Organisation);
exports.addUserToOrganization = addUserToOrg();

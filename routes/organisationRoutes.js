const express = require("express");
const { protect } = require("../controllers/authController");
const {
  getAllOrganisations,
  getOrganisations,
  createOrganisation,
  addUserToOrganization,
} = require("../controllers/organisationController");

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.route("/").get(getAllOrganisations).post(createOrganisation);
router.post("/:orgId/users", addUserToOrganization);
router.get("/:orgId", getOrganisations);

module.exports = router;

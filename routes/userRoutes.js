const express = require("express");
const { getUser, getDefault } = require("../controllers/userController");
const { signup, login, protect } = require("../controllers/authController");

const router = express.Router();

router.post("/auth/register", signup);
router.post("/auth/login", login);
router.get("/", getDefault);
router.use(protect);

router.get("/api/users/:id", getUser);

module.exports = router;

const express = require("express");
const { getUser } = require("../controllers/userController");
const { signup, login, protect } = require("../controllers/authController");

const router = express.Router();

router.post("/api/auth/register", signup);
router.post("/api/auth/login", login);
router.use(protect);

router.get("/api/users/:id", getUser);

module.exports = router;

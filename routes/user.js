const express = require("express");
const router = express.Router();

const { login, register, getAllUsers } = require("../controllers/user");
const authMiddleware = require('../middleware/auth')

router.route("/login").post(login);
router.route("/register").post(register);
// router.route("/dashboard").get(authMiddleware, dashboarda)a;
router.route("/users").get(getAllUsers);


module.exports = router;
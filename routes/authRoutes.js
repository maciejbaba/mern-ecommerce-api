const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const requestLimiter = require("../middleware/requestLimiter");

router.route("/login")
  .post(requestLimiter, authController.login);

router.route("/refresh")
  .get(requestLimiter, authController.refresh);

router.route("/logout")
  .post(requestLimiter, authController.logout);

module.exports = router;
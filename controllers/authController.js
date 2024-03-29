const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt"); // used here to unhash the password
const jwt = require("jsonwebtoken");

// @desc    Login user
// @route   POST /auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body; // only username and password are needed to login

  if (!username) {
    return res.status(400).json({ message: "Please enter username" });
  }

  if (!password) {
    return res.status(400).json({ message: "Please enter password" });
  }

  const foundUser = await User.findOne({ username }).exec(); // username is unique, so only one user will be found

  if (!foundUser) {
    return res.status(401).json({ message: "User not found" });
  }

  if (!foundUser.active) {
    return res.status(401).json({ message: "User is inactive" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password); // compare the password with the hashed password in the database

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Password incorrect" });
  }

  const returnUser = { // user to return without the password
    id: foundUser._id,
    username: foundUser.username,
    isAdmin: foundUser.isAdmin,
    active: foundUser.active,
  };

  const accessToken = jwt.sign(
    { id: foundUser._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ accessToken, user: returnUser });
});

// @desc    Refresh token
// @route   GET /auth/refresh
// @access  Public - because access token expired

// @note    This route is not used in the frontend yet
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.jwt; // get the refresh token from the cookies

  if (!refreshToken) {
    return res.status(401).json({ message: "Please login" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, userId) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      const accessToken = jwt.sign(
        { id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken });
    }
  );
});

module.exports = {
  login,
  refresh,
};

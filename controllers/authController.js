const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt"); // used here to unhash the password
const jwt = require("jsonwebtoken");

// @desc    Login user
// @route   POST /auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    // if username or password is not provided, todo change to handling it seperately with two different response messages
    return res
      .status(400)
      .json({ message: "Please enter username and password" });
  }

  const foundUser = await User.findOne({ username }).exec(); // find user by username

  // seperate it later to two different responses
  if (!foundUser || foundUser.active === false) {
    // if user is not found or user is not active
    return res.status(401).json({ message: "User not found or is inactive" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password); // compare the password with the hashed password in the database

  if (!isPasswordCorrect) {
    // if password is not correct
    return res.status(401).json({ message: "Password incorrect" });
  }

  const accessToken = jwt.sign(
    { id: foundUser._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  ); // create access token

  const refreshToken = jwt.sign(
    { id: foundUser._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  ); // create refresh token

  res.json({ accessToken });
});

// @desc    Refresh token
// @route   GET /auth/refresh
// @access  Public - because access token expired
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

const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { json } = require("express");

// @description Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @description Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, isAdmin } = req.body;

  // check data
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password fields are required!" });
  }

  // check for duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Username taken" });
  }

  // encrypt the password
  const hashedPassword = await bcrypt.hash(password, 10); // 10 stands for amount of salt rounds

  // maybe change name to newUser?
  let userObject = {
    username,
    password: hashedPassword, // isAdmin will be false by default
  };

  // if isAdmin is specified use it
  if (isAdmin) {
    userObject = {
      username,
      password: hashedPassword,
      isAdmin,
    };
  }

  // create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res
      .status(400)
      .json({ message: "User has not been created - Invalid data received" });
  }
});

// @description Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, isAdmin, active, password } = req.body;

  // check data
  if (!id) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User has not been found" });
  }

  let duplicate;

  if (username) {
    duplicate = await User.findOne({ username }).lean().exec();
  }

  // allow update to the current user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Username taken" });
  }
  const oldUsername = user.username;

  if (username) {
    user.username = username;
  }

  if (isAdmin) {
    user.isAdmin = isAdmin;
  }

  if (active) {
    user.active = active;
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10); // 10 stands for amount of salt rounds
  }

  const updatedUser = await user.save();

  if (!updatedUser) {
    return res.status(400).json({ message: "User has not been updated" });
  }

  if (oldUsername !== updatedUser.username) {
    return res.json({
      message: `User ${oldUsername} has been updated to ${updatedUser.username}`,
    });
  }

  res.json({ message: `User ${updatedUser.username} has been updated` });
});

// @description Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User has not been found" });
  }

  const deletedUser = await user.deleteOne();

  if (!deletedUser) {
    return res.status(400).json({ message: "User has not been deleted" });
  }

  const reply = `User ${deletedUser.username} deleted`;

  res.json({ message: reply });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};

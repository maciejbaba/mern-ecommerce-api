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
  const { username, password, roles} = req.body;

  // check data
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password fields are required!" });
  }

  // check for duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Username taken" });
  }

  // encrypt the password
  const hashedPassword = await bcrypt.hash(password, 10); // 10 stands for amount of salt rounds

  let userObject

  // if roles are specified use them
  if (Array.isArray(roles) || roles) {
    userObject = {
      username,
      password: hashedPassword,
      roles,
    };
  } else { // because roles have default value in Schema they aren't necessary so proceed without
    userObject = {
      username,
      password: hashedPassword,
    };
  }

  // create and store new user
  const user = await User.create(userObject);

  if (user) {
    res
      .status(201)
      .json({ message: `New user ${username} created successfully!` });
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
  const { id, username, roles, active, password } = req.body

  // check data
  if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
    return res.status(400).json({ message: "All fields are required!" })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: "User has not been found"})
  }

  const duplicate = await User.findOne({ username }).lean().exec()
  // allow update to the current user

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Username taken" })
  }

  user.username = username
  user.roles = roles
  user.active = active
  // todo handle name and surname

  if (password) {
    // hash password
    user.password = await bcrypt.hash(password, 10) // 10 stands for amount of salt rounds
  }

  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.username} has been updated` })
});

// @description Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: "User ID is required" })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: "User has not been found" })
  }

  const deletedUser = await user.deleteOne()

  const reply = `User ${deletedUser.username} with ID ${deletedUser.id} has been deleted`

  res.json({ message: reply})
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};

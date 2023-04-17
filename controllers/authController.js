const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt"); // used here to unhash the password
const jwt = require("jsonwebtoken");


// @desc    Login user
// @route   POST /auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {

});

// @desc    Register user
// @route   POST /auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  
});
  
// @desc    Refresh token
// @route   GET /auth/refresh
// @access  Public - because access token expired
const refresh = asyncHandler(async (req, res) => {
    
});

// @desc    Logout user
// @route   POST /auth/logout
// @access  Public 
const logout = asyncHandler(async (req, res) => {
    
});

module.exports = {
  login,
  register,
  refresh,
  logout,
};
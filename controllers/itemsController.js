const Item = require("../models/Item");
const asyncHandler = require("express-async-handler");
const { json } = require("express");

const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find().lean();

  if (!items.length) {
    return res.status(400).json({ message: "No items found" });
  }

  res.json(items);
});

const createNewItem = asyncHandler(async (req, res) => {});

const updateItem = asyncHandler(async (req, res) => {});

const deleteItem = asyncHandler(async (req, res) => {});

module.exports = {
  getAllItems,
  createNewItem,
  updateItem,
  deleteItem,
};

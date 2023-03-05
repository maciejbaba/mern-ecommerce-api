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

const createNewItem = asyncHandler(async (req, res) => {
  const { name, description, price, photoURL } = req.body;

  // optionally add this handling for each field separately for better error messages
  if (!name || !description || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // search for duplicate
  const duplicate = await Item.findOne({ name }).lean().exec();

  if (duplicate) {
    return res
      .status(409) // conflict
      .json({ message: "Item with this name already exists" });
  }

  // photoURL is optional
  let itemObject;
  if (photoURL) {
    itemObject = {
      name,
      description,
      price,
      photoURL,
    };
  } else {
    itemObject = {
      name,
      description,
      price,
    };
  }

  // create and store in db new item
  const item = await Item.create(itemObject);

  if (item) {
    res.status(201).json({ message: "New item has been created!" });
  } else {
    res
      .status(400)
      .json({ message: "Item has not been created - Invalid data" });
  }
});

const updateItem = asyncHandler(async (req, res) => {});

const deleteItem = asyncHandler(async (req, res) => {});

module.exports = {
  getAllItems,
  createNewItem,
  updateItem,
  deleteItem,
};

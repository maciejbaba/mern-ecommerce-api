const { id } = require("date-fns/locale");
const Item = require("../models/Item");
const asyncHandler = require("express-async-handler");

// @desc    Get all items
// @route   GET /items
// @access  Public

const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find().lean();

  if (!items.length) {
    return res.status(400).json({ message: "No items found" });
  }

  res.json(items);
});

// @desc    Create new item
// @route   POST /items
// @access  Public

const createNewItem = asyncHandler(async (req, res) => {
  const { name, description, price, photoURL } = req.body;

  // optionally add this handling for each field separately for better error messages
  if (!name || !description || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (typeof price !== "number") {
    return res.status(400).json({ message: "Price must be a number" });
  }

  if (price < 0) {
    return res.status(400).json({ message: "Price cannot be negative" });
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
    res.status(201).json({ message: "New item has been created" });
  } else {
    res
      .status(400)
      .json({ message: "Item has not been created - Invalid data" });
  }
});

// @desc    Update item
// @route   PATCH /items
// @access  Public

const updateItem = asyncHandler(async (req, res) => {
  const { id, name, description, price, photoURL } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  if (!name || !description || !price || !photoURL) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (typeof price !== "number") {
    return res.status(400).json({ message: "Price must be a number" });
  }

  if (price < 0) {
    return res.status(400).json({ message: "Price cannot be negative" });
  }

  const itemToChange = await Item.findById(id).exec();

  if (!itemToChange) {
    return res
      .status(400)
      .json({ message: "Item with this name has not been found" });
  }

  itemToChange.name = name;
  itemToChange.description = description;
  itemToChange.price = price;
  itemToChange.photoURL = photoURL;

  const updatedItem = await itemToChange.save();
  if (!updatedItem) {
    return res.status(400).json({ message: "Item has not been updated" });
  }
  res.json({ message: `Item has been updated` });
});

const deleteItem = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Name is required in order to delete an item" });
  }

  const itemToDelete = await Item.findOne({ name }).exec();

  if (!itemToDelete) {
    return res
      .status(404)
      .json({ message: "Item with this name has not been found" });
  }

  const deletedItem = await itemToDelete.deleteOne();

  res.json({ message: `Item with name ${deletedItem.name} has been deleted` });
});

module.exports = {
  getAllItems,
  createNewItem,
  updateItem,
  deleteItem,
};

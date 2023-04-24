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

const updateItem = asyncHandler(async (req, res) => {
  const { name, description, price, photoURL } = req.body;

  if (!name || !description || !price || !photoURL) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const itemToChange = await Item.findOne({ name }).exec();

  if (!itemToChange) {
    return res
      .status(400)
      .json({ message: "Item with this name has not been found" });
  }

  const duplicate = await Item.findOne({ name }).lean().exec();

  // allow changes to current item
  if (duplicate && duplicate?._id.toString() !== itemToChange._id.toString()) {
    return res.status(409).json({ message: "Specified name already exists" });
  }

  // add logic for newName in order to be able to change name (currently all logic relies on name)
  itemToChange.name = name;
  itemToChange.description = description;
  itemToChange.price = price;
  itemToChange.photoURL = photoURL;

  const updatedItem = await itemToChange.save();

  res.json({ message: `Item with ID ${updatedItem._id} has been updated` });
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
      .status(400)
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

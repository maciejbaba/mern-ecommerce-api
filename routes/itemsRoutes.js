const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const verifyJWT = require("../controllers/verifyJWT");

router
  .route("/")
  .get(itemsController.getAllItems)
  .post(itemsController.createNewItem)
  .patch(verifyJWT, itemsController.updateItem)
  .delete(verifyJWT, itemsController.deleteItem);

module.exports = router;

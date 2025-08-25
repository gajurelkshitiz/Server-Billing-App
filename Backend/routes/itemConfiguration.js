const express = require("express");
const router = express.Router();

// Import functions from the controllers:
const {
    getAllItemsConfig,
    createItemConfig,
    getItemConfig,
    updateItemConfig,
    deleteItemConfig
} = require("../controllers/itemConfiguration");

// routes here:
router.route("/")
    .get(getAllItemsConfig)
    .post(createItemConfig);

router.route("/:id")
    .get(getItemConfig)
    .patch(updateItemConfig)
    .delete(deleteItemConfig);

module.exports = router;
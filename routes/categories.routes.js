const express = require("express");
const categoryController = require("../controllers/cagetories.controller");
const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/:name", categoryController.getCategoryByName);
router.post("/", categoryController.createCategory);
router.patch("/", categoryController.updateCategory);
router.delete("/", categoryController.deleteCategory);

module.exports = router;

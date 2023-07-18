// to allow access to my server
const express = require("express");
// use the function from categoryController
const categoryController = require("../controllers/cagetories.controller");
// define the routs for the categories in my server. 
//get the results from the categoryController related function.
const router = express.Router();
// /category/: (define in app.js)
router.get("/", categoryController.getCategories);
router.get("/:name", categoryController.getCategoryByName);
router.post("/", categoryController.createCategory);
router.patch("/", categoryController.updateCategory);
router.delete("/", categoryController.deleteCategory);

module.exports = router;

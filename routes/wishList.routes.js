const express = require("express");
const wishListController = require("../controllers/wishList.controller");
const router = express.Router();

router.get("/", wishListController.getAllwishLists);
router.get("/:id", wishListController.getWishListById);
router.post("/", wishListController.createWishList);
router.patch("/", wishListController.updateWishList);
router.delete("/", wishListController.deleteWishList);

module.exports = router;

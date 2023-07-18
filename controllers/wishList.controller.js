const wishListService = require("../services/wishList.services");
const userService = require("../services/users.services");

/**
 * Retrieves all wishlists.
 * Sends a response with the retrieved wishlists.
 */
const getAllwishLists = async (req, res) => {
  try {
    const wishLists = await wishListService.getAllwishLists();
    res.status(200).send(wishLists);
  } catch (err) {
    res.status(400).send("Something went wrong -> getAllwishLists");
  }
};

/**
 * Retrieves a wishlist by ID.
 * Sends a response with the retrieved wishlist if found, or an error message if not found.
 */
const getWishListById = async (req, res) => {
  try {
    const { id } = req.params;
    const wishList = await wishListService.getWishListById(id);
    if (!wishList) return res.status(400).json("Wishlist not found");
    res.status(200).send(wishList);
  } catch (err) {
    res.status(400).send("Something went wrong -> getWishListById");
  }
};

/**
 * Creates a new wishlist.
 * Adds the new wishlist to the user's wishlist and sends a response with the new wishlist.
 */
const createWishList = async (req, res) => {
  try {
    const wishList = {
      user: req.body.user,
      games: req.body.games,
    };
    const newWishList = await wishListService.createWishList(wishList);
    const user = await userService.getUserById(wishList.user);
    user.wishList.push(newWishList._id);
    await userService.updateUser(user._id, user);
    res.status(200).send(newWishList);
  } catch (err) {
    res.status(400).send("Something went wrong -> createWishList");
  }
};

/**
 * Updates a wishlist.
 * Adds a game to the wishlist or removes games from the wishlist based on the "remove" flag.
 * Sends a response with the updated wishlist or appropriate messages indicating errors or successful updates.
 */
const updateWishList = async (req, res) => {
  try {
    const { id, remove, wishList } = req.body;
    if (!remove) {
      const oldWishList = await wishListService.getWishListById(id);
      if (oldWishList.games.includes(wishList))
        return res.status(400).json("Game already in wishlist");
      oldWishList.games.push(wishList);
      const updatedWishList = await wishListService.updateWishList(
        id,
        oldWishList
      );
      const user = await userService.getUserById(updatedWishList.user);
      await userService.updateUser(user._id, user);
      res.status(200).json("Game added to wishlist");
    } else {
      const { games } = req.body;
      const oldWishList = await wishListService.getWishListById(id);
      let newWishList = oldWishList.games.filter((game) => {
        return games.includes(game.toString());
      });

      oldWishList.games = newWishList;
      const updatedWishList = await wishListService.updateWishList(
        id,
        oldWishList
      );
      const user = await userService.getUserById(updatedWishList.user);
      await userService.updateUser(user._id, user);
      res.status(200).json("Wishlist updated");
    }
  } catch (err) {
    res.status(400).send("Something went wrong -> updateWishList");
  }
};

/**
 * Deletes a wishlist.
 * Removes the wishlist from the user's wishlist and sends a response with the deleted wishlist.
 */
const deleteWishList = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedWishList = await wishListService.getWishListById(id);
    const user = await userService.getUserById(deletedWishList.user);
    user.wishList.pull(deletedWishList._id);
    await userService.updateUser(user._id, user);
    await wishListService.deleteWishListById(id);
    res.status(200).send(deletedWishList);
  } catch (err) {
    res.status(400).send("Something went wrong -> deleteWishList");
  }
};

module.exports = {
  getAllwishLists,
  getWishListById,
  createWishList,
  updateWishList,
  deleteWishList,
};

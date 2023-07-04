const express = require("express");
const gameController = require("../../../ApplicationBackend/controllers/games.controller");
const router = express.Router();

router.get("/", gameController.getAllGames);
router.get("/:id", gameController.getGameById);
router.post("/", gameController.validateGame, gameController.createGame);
router.patch("/", gameController.validateGameUpdate, gameController.updateGame);
router.delete(
  "/",
  gameController.validateGameUpdate,
  gameController.deleteGame
);

module.exports = router;

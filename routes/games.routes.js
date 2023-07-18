
// define the routs for the games in my server. 
const express = require("express");
const gameController = require("../controllers/games.controller");
const router = express.Router();

router.get("/", gameController.getAllGames);
router.get("/:id", gameController.getGameById);
//middleware: if the first function will run without errors, it will continue to the second one.
router.post("/", gameController.validateGame, gameController.createGame);
router.patch("/", gameController.validateGameUpdate, gameController.updateGame);
router.delete("/",gameController.validateGameUpdate,gameController.deleteGame);

module.exports = router;

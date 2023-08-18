const express = require("express");
const { addNewWinningNumber, getAllWinningNumbers , userPredictionNumber} = require("../controllers/winningControllers.js");
const router = express.Router();

router.get("/winning_numbers", getAllWinningNumbers);
router.post("/winning_number", addNewWinningNumber);
router.post("/user/prediction_number", userPredictionNumber);

module.exports = router;
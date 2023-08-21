const express = require("express");
const { addNewWinningNumber, getAllWinningNumbers, userPredictionNumber, editUserPredictionNumber, getUserPredictionNumber } = require("../controllers/winningControllers.js");
const { verifyAdmin } = require("../controllers/adminControllers.js");
const { verifyUser } = require("../controllers/userControllers.js");
const router = express.Router();

router.get("/winning_numbers", verifyAdmin, getAllWinningNumbers);
router.post("/winning_number", verifyAdmin, addNewWinningNumber);
router.post("/user/prediction_number", verifyUser, userPredictionNumber);
router.put("/user/prediction_number", verifyUser, editUserPredictionNumber);
router.get("/user/prediction_number", verifyUser, getUserPredictionNumber);

module.exports = router;
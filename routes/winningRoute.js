const express = require("express");
const { addNewWinningNumber, EditWinningNumber, getAllWinningNumbers, userPredictionNumber, editUserPredictionNumber, getUserPredictionNumber, getUserPredictionHistory } = require("../controllers/winningControllers.js");
const { verifyAdmin } = require("../controllers/adminControllers.js");
const { verifyUser, checkTime } = require("../controllers/userControllers.js");
const router = express.Router();

router.get("/winning_numbers", getAllWinningNumbers);
router.post("/winning_number", addNewWinningNumber);
router.put("/winning_number", EditWinningNumber);
router.post("/user/prediction_number", verifyUser, checkTime, userPredictionNumber);
router.post("/user/edit_prediction_number", verifyUser, checkTime, editUserPredictionNumber);
router.get("/user/prediction_number", verifyUser, getUserPredictionNumber);
router.get("/user/user_history", verifyUser, getUserPredictionHistory);

module.exports = router;
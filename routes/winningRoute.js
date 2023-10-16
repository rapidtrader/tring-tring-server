const express = require("express");
const { addNewWinningNumber, EditWinningNumber, getAllWinningNumbers, getWinners, userPredictionNumber, AddUserPredictionNumber, editUserPredictionNumber, getUserPredictionNumber, getUserPredictionHistory } = require("../controllers/winningControllers.js");
// const { verifyAdmin } = require("../controllers/adminControllers.js");
const { verifyUser } = require("../controllers/userControllers.js");
const router = express.Router();

router.get("/winning_numbers", getAllWinningNumbers);
router.post("/winning_number", addNewWinningNumber);
router.put("/winning_number", EditWinningNumber);
router.get("/winners", getWinners);
router.post("/user/prediction_number", verifyUser, userPredictionNumber);
router.put("/user/prediction_number", verifyUser, editUserPredictionNumber);
router.post("/user/edit_prediction_number", verifyUser, AddUserPredictionNumber);
router.get("/user/prediction_number", verifyUser, getUserPredictionNumber);
router.get("/user/user_history", verifyUser, getUserPredictionHistory);

module.exports = router;
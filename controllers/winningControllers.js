const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Winning = require("../models/winningModel.js");
const UserPrediction = require("../models/userPredictionModel.js");

const getAllWinningNumbers = asyncHandler(async (req, res) => {
    await Winning.find({}).then((winningNumbers) => {
        res.status(200).json(winningNumbers);
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

const addNewWinningNumber = asyncHandler(async (req, res) => {
    const { winningNumber } = req.body;

    const winning = new Winning({
        winningNumber,
    });

    await winning.save().then((winningNumber) => {
        res.status(201).json({ message: "Winning numbers added successfully" });
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

const userPredictionNumber = asyncHandler(async (req, res) => {

    const { predictionNumber } = req.body;

    const userPrediction = new UserPrediction({
        predictionNumber,
    });

    await userPrediction.save().then((predictionNumber) => {
        res.status(201).json({ message: "Prediction added successfully" });
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });

})

module.exports = { getAllWinningNumbers, addNewWinningNumber, userPredictionNumber };
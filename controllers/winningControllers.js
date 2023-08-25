const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Draw = require("../models/draw.js");
const Transaction = require("../models/transaction.js");
const User = require("../models/user.js");

const getAllWinningNumbers = asyncHandler(async (req, res) => {
    await Draw.find({}).then((winningNumbers) => {
        res.status(200).json(winningNumbers);
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

const addNewWinningNumber = asyncHandler(async (req, res) => {
    const { winningNumber } = req.body;

    const winning = new Draw({
        winning_number: winningNumber,
    });

    await winning.save().then((winningNumber) => {
        res.status(201).json({ message: "Winning numbers added successfully" });
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

const userPredictionNumber = asyncHandler(async (req, res) => {

    const user = req.userData.user;
    const { predictionNumber } = req.body;

    await User.findOne({ phoneNumber: user }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            const userId = user._id;
            const userPrediction = new Transaction({
                user_id: userId,
                prediction_number: predictionNumber,
            });

            userPrediction.save().then(() => {
                res.status(201).json({ message: "Prediction Number added successfully" });
            }).catch((err) => {
                res.status(400).json({ message: err.message });
            });
        }
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });

})

function formatDateToDDMMYYYY(timestamp) {
    const date = new Date(timestamp);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

function formatAMPM(timestamp) {
    var hours = timestamp.getHours();
    var minutes = timestamp.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours.padStart(2, '0') ? hours : 12; // the hour '0' should be '12'
    minutes = minutes.padStart(2, '0') < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

const editUserPredictionNumber = asyncHandler(async (req, res) => {

    const user = req.userData.user;
    const { predictionNumber } = req.body;

    await User.findOne({ phoneNumber: user }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            const userId = user._id;
            const userPrediction = new Transaction({
                user_id: userId,
                prediction_number: predictionNumber,
            });

            userPrediction.save().then(() => {
                res.status(201).json({ message: "Prediction Number Updated successfully" });
            }).catch((err) => {
                res.status(400).json({ message: err.message });
            });
        }
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

const getUserPredictionNumber = asyncHandler(async (req, res) => {
    const user = req.userData.user;

    await User.findOne({ phoneNumber: user }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            const userId = user._id;
            Transaction.find({ userPhoneNumber: userId }).then((userPrediction) => {
                if (!userPrediction) {
                    return res.status(404).json({ message: "User prediction not found" });
                }
                else {
                    res.status(200).json(userPrediction);
                }
            }).catch((err) => {
                res.status(400).json({ message: err.message });
            });
        }
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    }); 
});

module.exports = { getAllWinningNumbers, addNewWinningNumber, userPredictionNumber, editUserPredictionNumber, getUserPredictionNumber };
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Winning = require("../models/winningModel.js");
const UserPrediction = require("../models/userPredictionModel.js");
const User = require("../models/usersModel.js");

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

    const user = req.userData.user;
    const { predictionNumber } = req.body;

    await User.findOne({ phoneNumber: user }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            const userId = user._id;
            const userPrediction = new UserPrediction({
                userPhoneNumber: userId,
                predictionNumber,
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

const editUserPredictionNumber = asyncHandler(async (req, res) => {

    const user = req.userData.user;
    const { predictionNumber } = req.body;

    await User.findOne({ phoneNumber: user }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            let userId = user._id;

            UserPrediction.find({ userPhoneNumber: userId }).then((result) => {
                if (!result) {
                    return res.status(404).json({ message: "User prediction not found" });
                }
                else {
                    result.map((item) => {
                        const createdAtToday = formatDateToDDMMYYYY(item.createdAt);
                        const today = formatDateToDDMMYYYY(Date.now());

                        if (createdAtToday === today) {
                            userId = item._id;
                            return res.status(409).json({ message: "You have already predicted for today" });
                        }
                    });
                }
            }).catch((err) => {
                res.status(400).json({ message: err.message });
            });

            UserPrediction.updateOne({ userPhoneNumber: userId }, { $set: { predictionNumber: predictionNumber } }).then(() => {
                res.status(201).json({ message: "Prediction Number updated successfully" });
            }).catch((err) => {
                res.status(409).json({ message: err.message });
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
            UserPrediction.find({ userPhoneNumber: userId }).then((userPrediction) => {
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
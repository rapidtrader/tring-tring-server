const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Draw = require("../models/draw.js");
const Transaction = require("../models/transaction.js");
const User = require("../models/user.js");
const Misc = require("../models/misc.js")
const mongoose = require('mongoose');

const getAllWinningNumbers = asyncHandler(async (req, res) => {
    await Draw.find({}).then((winningNumbers) => {
        res.status(200).json(winningNumbers);
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

const addNewWinningNumber = asyncHandler(async (req, res) => {
    const { winningNumber, youtubeUrl } = req.body;

    const winning = new Draw({
        winning_number: winningNumber,
        youtube_url: youtubeUrl
    });
    await User.updateMany({}, { $set: { tempPredictions: 1, addedPredictions: 0, editedPredictions: 0, adsViewed: 0, reset: true } });
    await Misc.findByIdAndUpdate("6538a4eb6024c2e9299ec20a", { resetToday: true })
    await winning.save().then((winningNumber) => {
        res.status(201).json({ message: "Winning number added successfully" });

    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

const EditWinningNumber = asyncHandler(async (req, res) => {
    const { winningNumber, youtube_url } = req.body;

    const draws = await Draw.find({});
    var editDrawId = "";
    draws.map((draw, index) => {
        if (index === (draws.length - 1)) {
            editDrawId = draw._id;
        }
    })

    await Draw.findOneAndUpdate({ _id: editDrawId }, { winning_number: winningNumber, youtube_url });
    res.status(200).json({ message: "Updated Successfully" });

})

const userPredictionNumber = asyncHandler(async (req, res) => {

    const user = req.userData.user;
    const { predictionNumber, announced } = req.body;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await User.findOne({ phoneNumber: user }).then((foundUser) => {
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            const userId = foundUser._id;
            if (announced) {
                const userPrediction = new Transaction({
                    user_id: userId,
                    prediction_number: predictionNumber,
                    transaction_date: tomorrow,
                });

                userPrediction.save().then(() => {
                    res.status(201).json({ message: "Prediction Number added successfully" });
                }).catch((err) => {
                    res.status(400).json({ message: err.message });
                });
            }
            else {
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
        }
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });

})

const editUserPredictionNumber = asyncHandler(async (req, res) => {
    const { predictionNumber, id } = req.body;
    const user = req.userData.user;
    const created_date_time = new Date();
    const objectId = new mongoose.Types.ObjectId(id);
    await User.findOne({ phoneNumber: user }).then((foundUser) => {
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            Transaction.findByIdAndUpdate(objectId, { prediction_number: predictionNumber, created_date_time }, { new: true }).then(() => {
                res.status(200).json({ message: "Updated Successfully" });
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

const AddUserPredictionNumber = asyncHandler(async (req, res) => {

    const user = req.userData.user;
    const { predictionNumber, announced } = req.body;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await User.findOne({ phoneNumber: user }).then((foundUser) => {
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            const userId = foundUser._id;
            if (announced) {
                const userPrediction = new Transaction({
                    user_id: userId,
                    prediction_number: predictionNumber,
                    transaction_date: tomorrow
                });

                userPrediction.save().then(() => {
                    res.status(201).json({ message: "Prediction Number Updated successfully" });
                }).catch((err) => {
                    res.status(400).json({ message: err.message });
                });
            } else {
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
        }
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

const getUserPredictionNumber = asyncHandler(async (req, res) => {
    const user = req.userData.user;

    await User.findOne({ phoneNumber: user }).then((foundUser) => {
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            const userId = foundUser._id;
            Transaction.find({ user_id: userId }).then((userPredictions) => {
                if (!userPredictions) {
                    return res.status(404).json({ message: "User prediction not found" });
                }
                else {
                    res.status(200).json(userPredictions);
                }
            }).catch((err) => {
                res.status(400).json({ message: err.message });
            });
        }
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});



const getUserPredictionHistory = asyncHandler(async (req, res) => {
    const user = req.userData.user;

    await User.findOne({ phoneNumber: user }).then((foundUser) => {
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            const userId = foundUser._id;
            (async () => {
                const userPredictions = await Transaction.find({ user_id: userId });
                const formattedUsersHistory = await formattedUserHistory(userPredictions);
                res.status(200).json(formattedUsersHistory);
            })();
        }
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

const formattedUserHistory = async (userPredictions) => {
    const formattedUHistory = [];
    const draws = await Draw.find();
    userPredictions.forEach((userPrediction) => {
        const { _id, transaction_date, created_date_time, prediction_number } = userPrediction;
        const winning_numbers = [];
        const youtube_urls = [];
        draws.forEach((draw) => {
            c_date = formatDateToDDMMYYYY(draw.created_date_time);
            t_date = formatDateToDDMMYYYY(transaction_date);
            if (t_date === c_date) {
                winning_numbers.push(draw.winning_number)
                youtube_urls.push(draw.youtube_url)
            }
        })
        const winning_number = winning_numbers[0];
        const youtube_url = youtube_urls[0];
        formattedUHistory.push({
            _id,
            transaction_date,
            created_date_time,
            prediction_number,
            winning_number,
            youtube_url
        });
    });
    return formattedUHistory;
}
const getWinners = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find();
    const formattedWinners = await formatWinners(transactions);
    res.status(200).json(transactions);

});

const formatWinners = async (transactions) => {
    const formattedUHistory = [];
    const draws = await Draw.find();
    return formattedUHistory;
}


module.exports = { getAllWinningNumbers, addNewWinningNumber, EditWinningNumber, getWinners, userPredictionNumber, AddUserPredictionNumber, editUserPredictionNumber, getUserPredictionNumber, getUserPredictionHistory };
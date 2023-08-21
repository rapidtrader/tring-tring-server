const mongoose = require('mongoose');
const User = require('./usersModel');

const userPredictionSchema = new mongoose.Schema({
    userPhoneNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    predictionNumber: {
        type: Number,
        required: true,
    }
}, { timestamps: true }
);

const UserPrediction = mongoose.model('UserPrediction', userPredictionSchema);

module.exports = UserPrediction;
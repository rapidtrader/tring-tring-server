const mongoose = require('mongoose');
const User = require('./usersModel');

const userPredictionSchema = new mongoose.Schema({
    predictionNumber: {
        type: Number,
        required: true,
    }
}, { timestamps: true }
);

const UserPrediction = mongoose.model('UserPrediction', userPredictionSchema);

module.exports = UserPrediction;
const mongoose = require('mongoose');

const winningSchema = new mongoose.Schema({
    winningNumber: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const Winning = mongoose.model('Winning', winningSchema);

module.exports = Winning;

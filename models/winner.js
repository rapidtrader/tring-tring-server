const mongoose = require('mongoose');
const Draw = require('./draw');
const User = require('./user');

const winnerSchema = new mongoose.Schema({
    draw_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Draw',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    prize_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Draw',
    },

}, { timestamps: true }
);

const Winner = mongoose.model('Winner', winnerSchema);

module.exports = Winner;
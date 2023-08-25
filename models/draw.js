const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
    draw_date: {
        type: Date,
    },
    draw_type: {
        type: String,
        default: "null"
    },
    prize_type: {
        type: String,
        default: "null"
    },
    winning_number: {
        type: Number,
        required: true,
    },
    created_date_time: {
        type: Date,
        default: Date.now,
    },
    reveal_date_time: {
        type: Date,
    },
    total_no_of_winners: {
        type: Number,
    },
}, { timestamps: true }
);

const Draw = mongoose.model('Draw', drawSchema);

module.exports = Draw;

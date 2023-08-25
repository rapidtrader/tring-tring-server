const mongoose = require('mongoose');
const User = require('./user');

const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type_ivr_web_mobileApp: {
        type: String,
        default: "null"
    },
    os: {
        type: String,
        default: "null"
    },
    device_model: {
        type: String,
        default: "null"
    },
    web_browser: {
        type: String,
        default: "null"
    },
    region_of_call: {
        type: String,
        default: "null"
    },
    ip_address: {
        type: String,
        default: "null"
    },
    prediction_number: {
        type: Number,
        required: true,
    },
    transaction_date: {
        type: Date,
        default: Date.now,
    },
    created_date_time: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
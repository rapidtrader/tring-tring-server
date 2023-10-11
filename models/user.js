const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    phoneNumber: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return /^([0-9]{10}$)/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        },
    },

    name: {
        type: String,
    },

    age: {
        type: Number,
        default: "null",
        min: 0,
        max: 100
    },

    email: {
        type: String,
        default: null,
    },

    gender: {
        type: String,
        default: "null"
    },

    ip_address: {
        type: String,
        default: "null"
    },

    location: {
        type: String,
        default: "null"
    },

    region: {
        type: String,
        default: "null"
    },

    language: {
        type: String,
        default: "null"
    },

    notificationsEnabled: {
        type: Boolean,
        default: true,
    },

    password: {
        type: String,
        required: true,
    },
    predictions: {
        type: Number,
        default: 0,
    },
    tempPredictions: {
        type: Number,
        default: 0
    },
    addedPredictions: {
        type: Number,
        default: 0
    },
    editedPredictions: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
})

const User = mongoose.model('User', userSchema);

module.exports = User;

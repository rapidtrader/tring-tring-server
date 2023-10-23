const mongoose = require('mongoose');

const miscSchema = mongoose.Schema({

    resetToday: {
        type: Boolean,
        default: false
    }
})

const Misc = mongoose.model('Misc', miscSchema);

module.exports = Misc;

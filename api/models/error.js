const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const errorSchema = new Schema({

    controller: {
        type: String
    },

    function: {
        type: String
    },
    line: {
        type: String
    },
    detail: {
        type: String
    },
    code: {
        type: String
    },
    fixed: {
        type: Boolean,
        default: false
    }
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Error', errorSchema);


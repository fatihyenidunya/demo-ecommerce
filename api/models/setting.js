const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const settingSchema = new Schema({

    company: {
        type: String
    },
    userName: {
        type: String
    },
    password: {
        type: String
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Setting', settingSchema);


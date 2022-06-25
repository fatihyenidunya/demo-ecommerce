const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const emailSchema = new Schema({

    owner: {
        type: String
    },

    smtp: {
        type: String
    },
    port: {
        type: Number
    },
    secure: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('Email', emailSchema);


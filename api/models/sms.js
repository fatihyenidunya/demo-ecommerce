const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const smsSchema = new Schema({

    gsmNo: {
        type: String
    },
    customer: {
        type: String
    },
    message: {
        type: String
    },
    messageFor: {
        type: String
    },
    status: {
        type: String
    },
    success: {
        type: Boolean
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Sms', smsSchema);


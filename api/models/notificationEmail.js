const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationEmailSchema = new Schema({

    whose: {
        type: String
    },

    email: {
        type: String
    },
    whatFor: {
        type: String
    }
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('NotificationEmail', notificationEmailSchema);


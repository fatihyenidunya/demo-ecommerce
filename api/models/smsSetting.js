const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const smsSettingSchema = new Schema({


    company: {
        type: String
    },

    api: {
        type: String
    },

    userCode: {
        type: String
    },
    password: {
        type: String        
    },
    msgHeader: {
        type: String
    } 

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('SmsSetting', smsSettingSchema);


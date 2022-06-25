const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const babkAccountSchema = new Schema({

    bank: {
        type: String
    },
    branch: {
        type: String
    },
    accountNo: {
        type: String
    },

    currency: {
        type: String
    },
    ibanNo: {
        type: String
    },

    swiftCode:{
        type:String
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('BankAccount', babkAccountSchema);


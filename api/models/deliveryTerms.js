const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deliveryTermsAccountSchema = new Schema({

    deliveryTerm: {
        type: String
    },

 

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('DeliveryTerms', deliveryTermsAccountSchema);


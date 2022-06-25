const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderAgreementSchema = new Schema({

    orderId: {
        type: Schema.Types.ObjectId,
    },

    agreement: {
        type: String
    },
   

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('OrderAgreement', orderAgreementSchema);


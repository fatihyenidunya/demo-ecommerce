const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const paymentSchema = new Schema({


    referanceCode:{
        type:String
    },
    sale: {
        type: Object
    },
    buyer: {
        type: Object
    },
    shippingAddress: {
        type: Object
    },
    billingAddress: {
        type: Object
    },
    basketItems: {
        type: Object
    },
    errorMessage: {
        type: String,
        default: ''
    },
    orderId:{
        type:ObjectId
      
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Payment', paymentSchema);


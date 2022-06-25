const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const orderProductTransactionSchema = new Schema({


    orderId: {
        type: Schema.Types.ObjectId
    },
    productId: {
        type: Schema.Types.ObjectId
    },
    product: {
        type: String
    },
    productNumber: {
        type: Number
    },
     imageUrl: {
        type: String
    },
    operation: {
        type: String,

    },
    canceled: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String,

    },

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('OrderProductTransaction', orderProductTransactionSchema);


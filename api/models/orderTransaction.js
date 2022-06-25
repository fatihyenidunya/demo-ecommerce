const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const orderTransactionSchema = new Schema({


    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    },
    status: {
        type: String,
        default: 'Pending Approval'
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String,
        default: 'System'

    },

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('OrderTransaction', orderTransactionSchema);


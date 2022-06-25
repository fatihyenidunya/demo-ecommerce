const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const orderRetailTransactionSchema = new Schema({


    orderId: {
        type: Schema.Types.ObjectId,
        ref: "OrderRetail"
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

module.exports = mongoose.model('OrderRetailTransaction', orderRetailTransactionSchema);


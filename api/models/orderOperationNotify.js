const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderOperationNotify = new Schema({

    orderId: {
        type: Schema.Types.ObjectId,
    },

    country: {
        type: String
    },
    customer: {
        type: String
    },
    status: {
        type: String
    },
    grandTotal: {
        type: String
    },
    orderOwner: {
        type: String
    },
    currency: {
        type: String
    },
    number: {
        type: Number
    },  
    isSeen: {
        type: Boolean,
        default: false
    },
    notifyFor:{
        type: String
    },
    seenDate: {
        type: Date,
        default: Date.now

    },
    isChecked: {
        type: Boolean,
        default: false
    },
    checkedDate: {
        type: Date,
        default: Date.now
    },

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('OrderOperationNotify', orderOperationNotify);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderNotify = new Schema({

    orderId: {
        type: Schema.Types.ObjectId,
    },
    notifyFor: {
        type: String,
        default: 'customer'
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
    seenDate: {
        type: Date,
        default: Date.now

    },
    userName: {
        type: String,
        default: 'System'
    },
    userRole: {
        type: String
    },
    notifyOwner: {
        type: String
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

module.exports = mongoose.model('OrderNotify', orderNotify);


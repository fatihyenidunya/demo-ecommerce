const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderRetailSchema = new Schema({

    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    customer: {
        type: String
    },
    referanceCode: {
        type: String
    },
    billing: [],
    delivery: [],

    grandTotal: {
        type: Number
    },
    currency: {
        type: String
    },
    note: {
        type: String,
        default: '-'

    },
    paymentStatus: {
        type: String,
        default: ''

    },
    cargoCompany: {
        type: String

    },
    trackingCode: {
        type: String
    },
    shipmentDate: {
        type: Date
    },
    paymentId: {
        type: String
    },
    status: {
        type: String,
        default: 'Pending Approval',
    },
    isApproved: {
        type: Boolean,
        default: false
    },

    products: [{
        type: Object
    }],

    userName: {
        type: String,
        default: 'System'

    }

}
    , {
        timestamps: true

    });


module.exports = mongoose.model('OrderRetail', orderRetailSchema);



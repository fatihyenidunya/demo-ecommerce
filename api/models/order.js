const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({

    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    customer: {
        type: String
    },

    totalProduct: {
        type: Number
    },
    grandTotal: {
        type: Number
    },
    originTotalProduct: {
        type: Number,
        default: 0
    },
    originGrandTotal: {
        type: Number,
        default: 0
    },
    promotionProductNumber: {
        type: Number,
        default: 0
    },
    promotionProductTotalPrice: {
        type: Number,
        default: 0
    },
    shippedProductNumber: {
        type: Number,
        default: 0
    },
    shippedProductTotalPrice: {
        type: Number,
        default: 0
    },

    currency: {
        type: String
    },
    customerNote: {
        type: String,
        default: ''

    },
    operationalNote: {
        type: String,
        default: ''

    },
    status: {
        type: String,
        default: 'Pending Approval',
    },
    number: {
        type: Number,
        default: 1
    },
    isApproved: {
        type: Boolean,
        default: false
    },

    country: {
        type: String
    },

    products: [{
        type: Object
    }],

    owner: {
        type: String,
        default: 'System'

    },
    billingAddress: {},
    deliveryAddress: {},
    paymentBankAccount: {},
    deliveryTime: {
        type: String,
        default: ''
    },
    paymentTerm: {
        type: String,
        default: ''
    },
    paymentBased: {
        type: String,
        default: ''
    },
    totalWeight: {
        type: Number,
        default: 0
    },
    totalWeightEntity: {
        type: String,
        default: ''
    },
    totalVolume: {
        type: Number,
        default: 0
    },
    pallet: {
        type: String,
        default: ''

    },
    estimatedDate: {
        type: Date,
        default: new Date(+new Date() + 30 * 24 * 60 * 60 * 1000)

    },

    totalBoxes: {
        type: Number,
        default: ''
    },

}
    , {
        timestamps: true

    });


module.exports = mongoose.model('Order', orderSchema);

orderSchema.virtual('orderProduct', {
    ref: 'OrderProduct',
    localField: '_id',
    foreignField: 'order',
    justOne: false,
})


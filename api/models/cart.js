const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartSchema = new Schema({

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productTitle: {
        type: String
    },
    productTitleLower: {
        type: String
    },
    stockCode: {
        type: String
    },
    unit: {
        type: Number
    },

    unitPrice: {
        type: Number,
        required: true
    },
    volume: {
        type: String
    },
    volumeEntity: {
        type: String
    },

    totalPrice: {
        type: Number
    },
    currency: {
        type: String,
        required: true
    },



}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Cart', cartSchema);


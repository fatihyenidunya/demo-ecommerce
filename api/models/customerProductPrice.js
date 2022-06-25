const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const customerProductPriceSchema = new Schema({

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productTitle: {
        type: String,     
    },
    productTurkishTitle: {
        type: String,     
    },
    order: {
        type: Number,
        default: 0
    },

    unitPrice: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('CustomerProductPrice', customerProductPriceSchema);


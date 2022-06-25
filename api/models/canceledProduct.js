const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const canceledProductSchema = new Schema({

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    unit: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    box: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number       
    },
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('CanceledProduct', canceledProductSchema);


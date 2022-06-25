const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shippedProductSchema = new Schema({

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
    grossWeight:{
        type:Number
    },
    emptyBoxWeight:{
        type:Number
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
 
    promotion:{
        type:Boolean,
        default:false
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('ShippedProduct', shippedProductSchema);


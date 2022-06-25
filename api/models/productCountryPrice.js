const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const productCountryPriceSchema = new Schema({

    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    countryCode: {
        type: String
    },
    country: {
        type: String
    },

    title: {
        type: String
    },

    categoryNameLower: {
        type: String
    },
    currency: {
        type: String,
        default: ''
    },
    listPrice: {
        type: Number,
        default: 0.00
    },
    salePrice: {
        type: Number,
        default: 0.00
    },

    discount: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    },
    orderQuantity: {
        type: Number,
        default: 1
    },
    mainPage: {
        type: Boolean,
        default: false
    },
    freeCargo: {
        type: Boolean,
        default: false
    },
    cargoFee: {
        type: Number,
        default: 0
    }







    // _id:{
    //     type: Schema.Types.ObjectId,
    // }

});

module.exports = mongoose.model('ProductCountryPrice', productCountryPriceSchema);




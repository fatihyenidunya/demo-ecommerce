const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const productStockLogSchema = new Schema({
    productId: {
        type: ObjectId
    },

    title: {
        type: String,
        text: true
    },
    previousStock: {
        type: Number
    },
    operation: {
        type: String
    },

    variable: {
        type: String
       
    },

    number: {
        type: Number,
        default: 0
    },
    lastStock: {
        type: Number
    },

    volume: {
        type: String
    },
    userName: {
        type: String

    },

},
    {
        timestamps: true

    }
);

module.exports = mongoose.model('ProductStockLog', productStockLogSchema);




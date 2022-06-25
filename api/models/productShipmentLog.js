const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const productShipmentLogSchema = new Schema({
    orderId: {
        type: ObjectId
    },
    productId: {
        type: ObjectId
    },

    title: {
        type: String,
        text: true
    },
    country: {
        type: String
    },
    customerId: {
        type: ObjectId
    },

    customer: {

        type: String
    },
    status: {
        type: String
    },
  
    orderNumber: {
        type: Number,
        default: 0
    },

    shipmentNumber: {
        type: Number,
        default: 0
    },
  
    productStockNote: {
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

module.exports = mongoose.model('ProductShipmentLog', productShipmentLogSchema);




const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderProductSchema = new Schema({

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
    title: {
        type: String
    },
    imageUrl: {
        type: String
    },
    volume: {
        type: String
    },
    volumeEntity: {
        type: String
    },
    quantityInBox: {
        type: String
    },
    grossWeight: {
        type: String
    },
    grossEntity: {
        type: String
    },
    unitPrice: {
        type: Number
    },
    unit: {
        type: Number
    },
    stock:{
        type:Number
    },
    box: {
        type: Number
    },
    boxWidth: {
        type: String
    },
    totalPrice: {
        type: Number
    },
    currency: {
        type: String
    },
    boxLength: {
        type: String
    },
    boxHeight: {
        type: String
    },
    boxEntity: {
        type: String
    },

    emptyBoxWeight: {
        type: String
    },   

    readyProductBoxNumber: {
        type: Number
    },
    status: {
        type: String

    },  
    canceled: {
        type: Boolean

    },
    promotion: {
        type: Boolean

    },
    turkishTitle: {
        type: String
    },


}
    , {
        timestamps: true

    });

module.exports = mongoose.model('OrderProduct', orderProductSchema);


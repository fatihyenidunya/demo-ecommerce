const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const detailReportSchema = new Schema({

    productId: {
        type: Schema.Types.ObjectId,

    },
    stockCode: {
        type: String
    },
    title: {
        type: String,
        default: ''
    },

    imageUrl: {
        type: String,
        default: ''
    },
    unit: {
        type: Number,
        default: 0
    },
    volume: {
        type: String
    },
    volumeEntity: {
        type: String
    },

    stock: {
        type: Number
    },

    grandTotal: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: '',
    },



});


module.exports = mongoose.model('DetailReport', detailReportSchema);




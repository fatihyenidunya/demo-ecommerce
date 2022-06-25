const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const promotionProductSchema = new Schema({

    orderId: {
        type: Schema.Types.ObjectId,

    },
    productId: {
        type: Schema.Types.ObjectId,
    },
    title: {
        type: String
    },
    turkishTitle: {
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
    status: {
        type: String
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
    categoryName: {
        type: String
    },
    categoryNameLower: {
        type: String
    }

}
    , {
        timestamps: true

    });


module.exports = mongoose.model('PromotionProduct', promotionProductSchema);




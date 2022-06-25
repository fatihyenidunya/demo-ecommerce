const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const productCardSemiProductSchema = new Schema({

    productCardId: {
        type: ObjectId
    },
    semiProductId: {
        type: ObjectId
    },
    semiProduct: {
        type: String
    },
    lotNo: {
        type: String
    },
    amount: {
        type: Number
    },
    amountEntity: {
        type: String
    },
    percentage: {
        type: Number
    },
    amountOfWhat: {
        type: Number
    },
    amountOfWhatEntity: {
        type: String
    },
    process: {
        type: String
    },
    stock: {
        type: Number,
        default: 0
    }


}
    , {
        timestamps: true

    });

module.exports = mongoose.model('ProductCardSemiProduct', productCardSemiProductSchema);


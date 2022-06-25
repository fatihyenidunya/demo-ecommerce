const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const productCardSchema = new Schema({


    name: {
        type: String
    },
    productId: {
        type: ObjectId
    },
    product: {
        type: String
    },
    productCompany: {
        type: String
    },
    productCardCompany: {
        type: String
    },
    volume: {
        type: String
    },
    volumeEntity: {
        type: String
    },
    productCardVolume: {
        type: Number
    },
    productCardVolumeEntity: {
        type: String
    }


}
    , {
        timestamps: true

    });

module.exports = mongoose.model('ProductCard', productCardSchema);


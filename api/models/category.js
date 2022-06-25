const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const categorySchema = new Schema({

    name: {
        type: String
    },

    turkishName: {
        type: String
    },
    nameLower: {
        type: String
    },
    isTopCategory: {
        type: Boolean,
        default: false
    },
    publish: {
        type: Boolean,
        default: false
    },
    mainPage: {
        type: Boolean,
        default: false
    },
    topCategoryId: {
        type: String,

    },
    topCategoryName: {
        type: String
    },
    topCategoryNameLower: {
        type: String
    },
    title: {
        type: String
    },
    metaDescription: {
        type: String
    }
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Category', categorySchema);


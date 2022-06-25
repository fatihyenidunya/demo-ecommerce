const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogSchema = new Schema({

    imageUrl: {
        type: String
    },

    title: {
        type: String
    },
    titleLower:{
        type:String
    },
    summary: {
        type: String
    },
    description: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    },
    writer: {
        type: String,
        default:'Admin'
    },
    mainPage: {
        type: Boolean,
        default: false
    },
    publish: {
        type: Boolean,
        default: false
    },
    metaDescription: {
        type: String
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Blog', blogSchema);


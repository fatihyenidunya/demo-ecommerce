const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const productSchema = new Schema({

    barcode: {
        type: String
    },
    company: {
        type: String
    },
    title: {
        type: String,
        required: true,
        text: true
    },
    order: {
        type: Number,
        default: 0
    },

    titleLower: {
        type: String
    },


    description: {
        type: String
    },
    metaDescription: {
        type: String
    },
  

    image: [],
    sizes: [],
    colors: [],
 


    categoryId: {
        type: ObjectId,
        ref: 'Category',
        required: true

    },
    categoryName: {
        type: String
    },
    categoryNameLower: {
        type: String

    },

    publish: {
        type: Boolean,
        default: false
    },
    mainPage: {
        type: Boolean,
        default: false
    },


    // _id:{
    //     type: Schema.Types.ObjectId,
    // }

}, {
    timestamps: true

});

module.exports = mongoose.model('Product', productSchema);




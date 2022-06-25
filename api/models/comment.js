const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const commentSchema = new Schema({


    productId: {
        type: ObjectId,
        ref: 'Product',
        required: true
    },

    customerId: {

        type: ObjectId,
        ref: 'IndividualCustomer',
        required: true
    },
    comment: {
        type: String
    },
    ranking: {
        type: Number
    },
    publish: {
        type: Boolean,
        default: false
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Comment', commentSchema);


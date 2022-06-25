const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const stockTransactionSchema = new Schema({

    inOrOut: {
        type: Boolean
    },
    reason:{
        type:String
    },
    productId:{
        type:Schema.Types.ObjectId
    },
    quantity:{
        type:Number
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);


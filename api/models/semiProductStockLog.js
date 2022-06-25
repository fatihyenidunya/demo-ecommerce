const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const semiProductStockLogSchema = new Schema({
    semiProductId: {
        type: ObjectId
    },

    material: {
        type: String,
        text: true
    },
    previousStock: {
        type: Number
    },
    operation: {
        type: String
    },
    number: {
        type: Number,
        default: 0
    },
    lastStock: {
        type: Number
    },

    stockNote: {
        type: String
    },
    userName: {
        type: String

    },

},
    {
        timestamps: true

    }
);


module.exports = mongoose.model('SemiProductStockLog', semiProductStockLogSchema);




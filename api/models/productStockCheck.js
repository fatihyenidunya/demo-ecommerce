const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productStockCheckSchema = new Schema({

    productId: {
        type: Schema.Types.ObjectId,
      
    },
    title: {
        type: String,
        default:''
    },

    imageUrl: {
        type: String,
        default:''
    },
    unit: {
        type: Number,
        default:0
    },
    box: {
        type: Number,
        default:0
    },

    volume: {
        type:String
    },
    quantityInBox: {
        type: Number,
        default:0
    },
    stock: {
        type: Number,
        default:0
    }


});


module.exports = mongoose.model('ProductStockCheck', productStockCheckSchema);




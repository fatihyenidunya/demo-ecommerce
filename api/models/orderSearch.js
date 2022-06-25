const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSearchSchema = new Schema({

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
    order: {
        type: Number,
        default:0
    },
    volume: {
        type:String
    },
    volumeEntity: {
        type:String
    },
    quantityInBox: {
        type: Number,
        default:0
    },
    stock: {
        type: Number,
        default:0
    },
    afterCalculatedStock:{
        type: Number,
        default:0
    },
    virtualStock:{
        type: Number,
        default:0
    },
    grandTotal: {
        type: Number,
        default:0,
    },
    currency: {
        type: String,
        default:'',
    },
   

    orders: [{
        type: Object
    }],
 

});


module.exports = mongoose.model('OrderSearch', orderSearchSchema);




const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const basketSchema = new Schema({

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    readyBox:{
        type:Number,
        default:0
    },
    readyUnit:{
        type:Number,
        default:0
    },
    stock:{
        type:Number,
        default:0
    },
    status:{
        type:String,    
        default:''   
    },
    box: {
        type: Number
    },
    unit: {
        type: Number
    },

    unitPrice: {
        type: Number,
        required: true
    },
    totalVolume: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    currency: {
        type: String,
        required: true
    }, 
  
   
  
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Basket', basketSchema);


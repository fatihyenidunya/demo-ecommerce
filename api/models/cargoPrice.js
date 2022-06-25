const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cargoPriceSchema = new Schema({

    company: {
        type: String
    },
    type: {
        type: String
    },   
    price: {
        type: Number
    },
    subLimit:{
        type:Number
    },
    limit:{ 
        type:Number
    },
    currency: {
        type: String
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('CargoPrice', cargoPriceSchema);


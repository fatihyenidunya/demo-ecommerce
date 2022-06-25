const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rawMaterialSchema = new Schema({

    name: {
        type: String
    },
    stock: {
        type: Number,
        default:0

    },
    stockEntity: {
        type: String
    },
   
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const quantityInBoxSchema = new Schema({

    detail: {
        type: String
    },
 
  
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('QuantityInBox', quantityInBoxSchema);


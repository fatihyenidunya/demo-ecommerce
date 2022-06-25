const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({

    customerId: {
        type: Schema.Types.ObjectId        
    },
    name: {
        type: String
    },
    country: {
        type: String
    },
  
    fax: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    officer: {
        type: String
    },
    address: {
        type: String
    },
    taxId: {
        type: String
    }
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Location', locationSchema);


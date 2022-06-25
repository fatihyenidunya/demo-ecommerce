const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transporterSchema = new Schema({

    company: {
        type: String
    },

    officer: {
        type: String
    },
    phone: {
        type: String
    },
    mobil: {
        type: String
    },
    email: {
        type: String
    }
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Transporter', transporterSchema);


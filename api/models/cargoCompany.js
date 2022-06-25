const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cargoCompanySchema = new Schema({

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

module.exports = mongoose.model('CargoCompany', cargoCompanySchema);


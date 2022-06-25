const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const customerSchema = new Schema({

    company: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },

    address: {
        type: String
    },
    phone: {
        type: String

    },
    fax: {
        type: String
    },
    taxId: {
        type: String
    },

    officer: {
        type: String
    },
    locations:[],

    owner: {
        type:String
    },
    ownerRole:{
        type:String
    }
   

}, {
    timestamps: true

});

module.exports = mongoose.model('Customer', customerSchema);


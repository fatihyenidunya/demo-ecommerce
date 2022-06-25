const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const individualCustomerSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    tcId: {
        type: String,
        required: true
    },
    taxPlace: {
        type: String

    },
    taxNo: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    openAddress: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    mailSended: {
        type: Boolean,
        default: false

    },
    document: {
        type: String
    }

}, {
    timestamps: true

});

module.exports = mongoose.model('IndividualCustomer', individualCustomerSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = new Schema({

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    addressName: {
        type: String
    },
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    identityNumber:{
        type:String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    company: {
        type: String
    },
    addressOne: {
        type: String
    },
    taxPlace: {
        type: String
    },
    taxNo: {
        type: String
    },
    zipCode: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },   
    countryCode: {
        type: String
    },
    
    
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Contact', contactSchema);


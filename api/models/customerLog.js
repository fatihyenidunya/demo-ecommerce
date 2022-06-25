const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const customerLogSchema = new Schema({


    customerId: {
        type: String,
        required: true
    },
    customerType: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String      
    },
    email: {
        type: String,
        required: true
    },

    ip:{
        type:String,
        required:true
    }

}, {
    timestamps: true

});

module.exports = mongoose.model('CustomerLog', customerLogSchema);


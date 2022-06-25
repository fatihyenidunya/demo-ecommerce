const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    role:{
        type:String,
        default:'Customer'
    },
    status: {
        type: String,
        default: 'I am new!'
    }
});

module.exports = mongoose.model('User', userSchema);
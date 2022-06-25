const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSchema = new Schema({

    name: {
        type: String,
        required:true
    },

    mail: {
        type: String,
        required:true
    },
    phone: {
        type: String
    },
    subject: {
        type: String       
    },  
    message: {
        type: String,
        required:true
    },
    type: {
        type:Boolean,
        default:false
    },
    answered: {
        type:Boolean,
        default:false
    },
    userName:{
        type:String,
        default:'System'
    },
    answer:{
        type:String,
        default:''
    },
    sendedBy:{
        type:String,
        default:'Contact'
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Message', messageSchema);


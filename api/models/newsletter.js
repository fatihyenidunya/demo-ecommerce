const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const newsletterSchema = new Schema({

    imageUrl: {
        type: String
    },
    link: {
        type: String
    },
    title: {
        type: String
    },
    type:{
        type:String
    },
    amount:{
        type:Number
    },
    subLimit:{
        type:Number
    },
    limit:{
        type:Number
    },
    code:{
        type:String
    },
    description: {
        type: String
    },
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    }


}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Newsletter', newsletterSchema);


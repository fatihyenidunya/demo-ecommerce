const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sliderSchema = new Schema({

    imageUrl: {
        type: String
    },

    title: {
        type: String
    },
    description: {
        type: String
    },
    link:{
        type:String
    },
    order: {
        type: String
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Slider', sliderSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const videoSchema = new Schema({

    videoUrl: {
        type: String
    },

    title: {
        type: String
    },
    order: {
        type: Number,
        default:0
    },
    mainPage: {
        type: Boolean,
        default:false
    },
    publish: {
        type: Boolean,
        default:false
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Video', videoSchema);


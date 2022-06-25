const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const menuSchema = new Schema({

    link: {
        type: String
    },

    icon: {
        type: String
    },
    name: {
        type: String
    },
    hide: {
        type: Boolean,
        default: false
    },

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Menu', menuSchema);


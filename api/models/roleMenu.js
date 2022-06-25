const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roleMenuSchema = new Schema({

    role: {
        type: String
    },
    link: {
        type: String
    },

    icon: {
        type: String
    },
    name: {
        type: String
    },
    order: {
        type: Number,
        default:0
    },

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('RoleMenu', roleMenuSchema);


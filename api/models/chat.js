const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'IndividualCustomer',
        required: true
    },

    message: {
        type: String,
        required: true
    },

    answered: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String

    },
    answer: {
        type: String

    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Chat', chatSchema);


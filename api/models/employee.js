const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const employeeSchema = new Schema({


    name: {
        type: String
    },
    role: {
        type: String
    }


}
    , {
        timestamps: true

    });

module.exports = mongoose.model('Employee', employeeSchema);


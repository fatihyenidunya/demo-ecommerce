const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roleSchema = new Schema({
    userRole: {
        type: String,
        required: true
    },
  
});

module.exports = mongoose.model('Role', roleSchema);
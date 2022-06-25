const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const warehouseNotify = new Schema({

    orderId: {
        type: Schema.Types.ObjectId,
    },

    country: {
        type: String
    },
    customer: {
        type: String
    },
    status: {
        type: String
    },
    notifyFor:{
        type: String
    },
  
    number: {
        type: Number
    },  
    isSeen: {
        type: Boolean,
        default: false
    },
    seenDate: {
        type: Date,
        default: Date.now

    },
    isChecked: {
        type: Boolean,
        default: false
    },
    checkedDate: {
        type: Date,
        default: Date.now
    },

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('WarehouseNotify', warehouseNotify);


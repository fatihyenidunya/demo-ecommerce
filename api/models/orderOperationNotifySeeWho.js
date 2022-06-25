const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderOperationNotifySeeWho = new Schema({

    orderId: {
        type: Schema.Types.ObjectId,
    },
  
    userName: {
        type: String
    },
 

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('OrderOperationNotifySeeWho', orderOperationNotifySeeWho);


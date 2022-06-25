const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cargoTrackingSchema = new Schema({

    orderId: {
        type: String
    },

    customer: {
        type: String
    },
    cargoCompany:{
        type:String
    },
    trackingNumber:{
        type:String,
    },
    
    orderDate: {
        type: Date,
        
    },
    shipmentDate: {
        type: String
    },
    grandTotal: {
        type: String
    }
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('CargoTracking', cargoTrackingSchema);


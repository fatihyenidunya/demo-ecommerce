const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pdfSchema = new Schema({

    customerId: {
        type: String
    },

    orderId: {
        type: String
    },

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('DealerPdf', pdfSchema);


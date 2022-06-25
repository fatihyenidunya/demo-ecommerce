const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shipmentDetailSchema = new Schema({


    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    country: {
        type: Schema.Types.String
    },
    customerId: {
        type: Schema.Types.ObjectId
    },
    customer: {
        type: Schema.Types.String
    },
    address: {
        type: Schema.Types.String
    },
    phone: {
        type: Schema.Types.String
    },
    email: {
        type: Schema.Types.String
    },
    fax: {
        type: Schema.Types.String
    },
    taxId: {
        type: Schema.Types.String
    },
    customCompany: {
        type: String
    },

    customOfficer: {
        type: String
    },
    customPhone: {
        type: String
    },
    customMobil: {
        type: String
    },
    deliveryTerms: {
        type: String
    },
    creditNumber: {
        type: String
    },
    grandTotal: {
        type: Number
    },
    foreignCurrencyPrice: {
        type: String
    },
    currency: {
        type: String
    },
    foreignPriceDescription: {
        type: String
    },
    localPriceDescription: {
        type: String
    },
    currencyToLocal: {
        type: String
    },
    kap: {
        type: String
    },
    customOffice: {
        type: String
    },
    customEmail: {
        type: String
    },
    payments: {
        type: String
    },

    transporterCompany: {
        type: String
    },

    transporterOfficer: {
        type: String
    },
    transporterPhone: {
        type: String
    },
    transporterMobil: {
        type: String
    },
    transporterEmail: {
        type: String
    },


    manifestPlace: {
        type: String
    },
    sealNo: {
        type: String
    },
    imoCode: {
        type: String
    },
    shipNameVoyage: {
        type: String
    },
    shipFlag: {
        type: String
    },
    entrancePort: {
        type: String
    },
    evacuationPort: {
        type: String
    },
    vgmCutOff: {
        type: String
    },
    manifestCutOff: {
        type: String
    },
    agency: {
        type: String
    },
    truckPlate: {
        type: String
    },
    driver: {
        type: String
    },
    goodImcoDetail: {
        type: String
    },
    hsCode: {
        type: String
    },
    gTypeCode: {
        type: String
    },
    phone: {
        type: String
    },
    note: {
        type: String
    },
    description: {
        type: String
    },
    producer1: {
        type: String
    },
    producer2: {
        type: String
    },
    producer3: {
        type: String
    },
    producer4: {
        type: String
    },
    notify: {
        type: String
    },
    currency: {
        type: String
    },
    localPrice: {
        type: Number
    },

    invoiceNumber: {
        type: String
    },
    madeBy: {
        type: String
    },
    bank: {
        type: String
    },
    brunch: {
        type: String
    },
    accountNo: {
        type: String
    },
    swiftCode: {
        type: String
    },
    ibanNo: {
        type: String
    },
    paymentCurrency: {
        type: String
    },
    owner: {
        type: String
    },
    products: [{
        type: Object
    }]
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('ShipmentDetail', shipmentDetailSchema);


const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Schema = mongoose.Schema;
const productionOrderSchema = new Schema({


    company: {
        type: String
    },
    productId: {
        type: ObjectId
    },
    productCardId: {
        type: ObjectId
    },
    productCard: {
        type: String
    },
    productCardCompany: {
        type: String
    },
    productCardVolume: {
        type: String
    },
    productCardVolumeEntity: {
        type: String
    },
    volume: {
        type: String
    },
    volumeEntity: {
        type: String
    },
    rawMaterial: {
        type: Object
    },
    semiProduct: {
        type: Object
    },
    productionDate: {
        type: Date
    },
    lastUsageDate: {
        type: Date
    },
    lotNo: {
        type: String,
        default:''
    },
    productionVolume: {
        type: Number
    },
    productionVolumeEntity: {
        type: String,
        default:'Kg'
    },
    attentionNote: {
        type: String,
        default:''
    },
    controlConclusion: {
        type: String,
        default:''
    },
    rawMaterials:{
        type:Object
    },
    semiProducts:{
        type:Object
    },
    paint: {
        type: String,
        default:''
    },
    producerPerson: {
        type: String
    },
    researcherOfficer: {
        type: String
    },
    qualityOfficer: {
        type: String
    },
    producerOfficer: {
        type: String
    },
    note: {
        type: String,
        default:''
    },
    status: {
        type: String
    },
    productBoxProduced: {
        type: Number,
        default: 0
    },
    wasteNumber: {
        type: String
    }
}
    , {
        timestamps: true

    });

module.exports = mongoose.model('ProductionOrder', productionOrderSchema);


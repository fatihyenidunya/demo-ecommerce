const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const generalSchema = new Schema({

    favicon: {
        type: String
    },

    title: {
        type: String
    },

    phone: {
        type: String
    },
    mail: {
        type: String
    },
    registerBtn: {
        type: String
    },
    loginBtn: {
        type: String
    },
    imageUrl: {
        type: String
    },


    aboutUs: {
        type: String
    },
    contact: {
        type: String
    },
    productsBtn: {
        type: String
    },
    catalog: {
        type: String
    },

    language: {
        type: String
    },

    imageUrlTwo: {
        type: String
    },


    imageUrlThree: {
        type: String
    },
    summary: {
        type: String
    },

    latestProducts: {
        type: String
    },

    info: {
        type: String
    },


    aboutUsText: {
        type: String
    },
    cargo: {
        type: String
    },
    cargoText: {
        type: String
    },

    privacyPolicy: {
        type: String
    },
    privacyPolicyText: {
        type: String
    },

    newsletterHeader: {
        type: String
    },

    instagram: {
        type: String
    },
    facebook: {
        type: String
    },
    youtube: {
        type: String
    },
    linkedin: {
        type: String
    },
    tweeter: {
        type: String
    },

    copyright: {
        type: String
    },

    messageText: {
        type: String
    },

    namePlaceholder: {
        type: String
    },
    lastNamePlaceholder: {
        type: String
    },
    phonePlaceholder: {
        type: String
    },
    messagePlaceholder: {
        type: String
    },


    contactText: {
        type: String
    },

    phoneText: {
        type: String
    },

    mailText: {
        type: String
    },
    webAdress: {
        type: String
    },
    address: {
        type: String
    },
    addressText: {
        type: String
    },
    workingHours: {
        type: String
    },
    workingHoursText: {
        type: String
    },


}
    , {
        timestamps: true

    });

module.exports = mongoose.model('General', generalSchema);


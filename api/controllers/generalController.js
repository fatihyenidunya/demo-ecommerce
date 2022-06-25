const mongodb = require('mongodb');
const General = require('../models/general');
const NewsletterMember = require('../models/newsletterMember');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');
const ObjectId = mongodb.ObjectId;

exports.getGenerals = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);

    try {
        const totalGeneral = await General.find().countDocuments();
        const generals = await General.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched succesfully',
            generals: generals,
            totalGeneral: totalGeneral
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('generalController', 'getGenerals', 10, 500, err);

        next(err);
    }

}

exports.getGeneral = (req, res, next) => {
    const generalId = req.params.generalId


    General
        .findById(generalId)
        .then(general => {

            if (!general) {

                const error = new Error('Could not find general');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'Slider fetched.', general: general })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('generalController', 'getGeneral', 40, 500, err);

            next(err);

        });

}

exports.postAddGeneral = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {

        if (!req.file) {
            console.log(req.file);

            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = req.file.path.replace("\\", "/");

        console.log(imageUrl)


        const general = new General({
            favicon: req.body.favicon,
            title: req.body.title,
            metaDescription: req.body.metaDescription,
            phone: req.body.phone,
            mail: req.body.mail,
            registerBtn: req.body.registerBtn,
            loginBtn: req.body.loginBtn,
            imageUrl: imageUrl,
            aboutUs: req.body.aboutUs,
            contact: req.body.contact,
            productsBtn: req.body.productsBtn,
            catalog: req.body.catalog,
            language: req.body.language,
            imageUrlTwo: req.body.imageUrlTwo,
            imageUrlThree: req.body.imageUrlThree,
            summary: req.body.summary,
            latestProducts: req.body.latestProducts,
            info: req.body.info,
            aboutUsText: req.body.aboutUsText,
            cargo: req.body.cargo,
            cargoText: req.body.cargoText,
            privacyPolicy: req.body.privacyPolicy,
            privacyPolicyText: req.body.privacyPolicyText,
            newsletterHeader: req.body.newsletterHeader,
            instagram: req.body.instagram,
            facebook: req.body.facebook,
            youtube: req.body.youtube,
            linkedin: req.body.linkedin,
            tweeter: req.body.tweeter,
            copyright: req.body.copyright,
            messageText: req.body.messageText,
            namePlaceholder: req.body.namePlaceholder,
            lastNamePlaceholder: req.body.lastNamePlaceholder,
            phonePlaceholder: req.body.phonePlaceholder,
            messagePlaceholder: req.body.messagePlaceholder,
            contactText: req.body.contactText,
            phoneText: req.body.phoneText,
            mailText: req.body.mailText,
            webAdress: req.body.webAdress,
            address: req.body.address,
            addressText: req.body.addressText,
            workingHours: req.body.workingHours,
            workingHoursText: req.body.workingHoursText
        });

        const result = await general.save();
        res.status(201).json({ statusCode: 201, message: 'General created!', generalId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('generalController', 'postAddGeneral', 72, 500, err);
        next(err);
    }
}

exports.postSecondImage = async (req, res, next) => {


    const generalId = req.body.generalId;



    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {

        if (!req.file) {
            console.log(req.file);

            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = req.file.path.replace("\\", "/");

        console.log(imageUrl)

        const oldGeneral = await (await General.findById(generalId));
        if (!oldGeneral) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }

        oldGeneral.imageUrlTwo = imageUrl;


        // console.log(oldGeneral)
        const result = await oldGeneral.save();


        res.status(201).json({ statusCode: 201, message: 'Second image uploaded!', generalId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('generalController', 'postSecondImage', 154, 500, err);
        next(err);
    }
}



exports.postNewsletterMail = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {

        const newsletterMember = new NewsletterMember({

            mail: req.body.mail

        });
        const result = await newsletterMember.save();
        res.status(201).json({ statusCode: 201, message: 'newsletter Member created!', newsletterMemberId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('generalController', 'postNewsletterMail', 209, 500, err);

        next(err);
    }
}

exports.putUpdateGeneral = async (req, res, next) => {
    const generalId = req.params.generalId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        console.log(req.file);

        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }


    const imageUrl = req.file.path.replace("\\", "/");

    console.log(imageUrl)

    const newGeneral = new General({
        favicon: req.body.favicon,
        title: req.body.title,
        metaDescription: req.body.metaDescription,
        phone: req.body.phone,
        mail: req.body.mail,
        registerBtn: req.body.registerBtn,
        loginBtn: req.body.loginBtn,
        imageUrl: imageUrl,
        aboutUs: req.body.aboutUs,
        contact: req.body.contact,
        productsBtn: req.body.productsBtn,
        catalog: req.body.catalog,
        language: req.body.language,

        imageUrlThree: req.body.imageUrlThree,
        summary: req.body.summary,
        latestProducts: req.body.latestProducts,
        info: req.body.info,
        aboutUsText: req.body.aboutUsText,
        cargo: req.body.cargo,
        cargoText: req.body.cargoText,
        privacyPolicy: req.body.privacyPolicy,
        privacyPolicyText: req.body.privacyPolicyText,
        newsletterHeader: req.body.newsletterHeader,
        instagram: req.body.instagram,
        facebook: req.body.facebook,
        youtube: req.body.youtube,
        linkedin: req.body.linkedin,
        tweeter: req.body.tweeter,
        copyright: req.body.copyright,
        messageText: req.body.messageText,
        namePlaceholder: req.body.namePlaceholder,
        lastNamePlaceholder: req.body.lastNamePlaceholder,
        phonePlaceholder: req.body.phonePlaceholder,
        messagePlaceholder: req.body.messagePlaceholder,
        contactText: req.body.contactText,
        phoneText: req.body.phoneText,
        mailText: req.body.mailText,
        webAdress: req.body.webAdress,
        address: req.body.address,
        addressText: req.body.addressText,
        workingHours: req.body.workingHours,
        workingHoursText: req.body.workingHoursText
    });

    try {
        const oldGeneral = await (await General.findById(generalId));
        if (!oldGeneral) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }


        oldGeneral.favicon = newGeneral.favicon;
        oldGeneral.title = newGeneral.title;
        oldGeneral.metaDescription = newGeneral.metaDescription;
        oldGeneral.phone = newGeneral.phone;
        oldGeneral.mail = newGeneral.mail;
        oldGeneral.registerBtn = newGeneral.registerBtn;
        oldGeneral.loginBtn = newGeneral.loginBtn;
        oldGeneral.imageUrl = newGeneral.imageUrl;
        oldGeneral.aboutUs = newGeneral.aboutUs;
        oldGeneral.contact = newGeneral.contact;
        oldGeneral.productsBtn = newGeneral.productsBtn;
        oldGeneral.catalog = newGeneral.catalog;
        oldGeneral.language = newGeneral.language;

        oldGeneral.imageUrlThree = newGeneral.imageUrlThree;
        oldGeneral.summary = newGeneral.summary;
        oldGeneral.latestProducts = newGeneral.latestProducts;
        oldGeneral.info = newGeneral.info;
        oldGeneral.aboutUsText = newGeneral.aboutUsText;
        oldGeneral.cargo = newGeneral.cargo;
        oldGeneral.cargoText = newGeneral.cargoText;
        oldGeneral.privacyPolicy = newGeneral.privacyPolicy;
        oldGeneral.privacyPolicyText = newGeneral.privacyPolicyText;
        oldGeneral.newsletterHeader = newGeneral.newsletterHeader;
        oldGeneral.instagram = newGeneral.instagram;
        oldGeneral.facebook = newGeneral.facebook;
        oldGeneral.youtube = newGeneral.youtube;
        oldGeneral.linkedin = newGeneral.linkedin;
        oldGeneral.tweeter = newGeneral.tweeter;
        oldGeneral.copyright = newGeneral.copyright;
        oldGeneral.messageText = newGeneral.messageText;
        oldGeneral.namePlaceholder = newGeneral.namePlaceholder;
        oldGeneral.lastNamePlaceholder = newGeneral.lastNamePlaceholder;
        oldGeneral.phonePlaceholder = newGeneral.phonePlaceholder;
        oldGeneral.messagePlaceholder = newGeneral.messagePlaceholder;
        oldGeneral.contactText = newGeneral.contactText;
        oldGeneral.phoneText = newGeneral.phoneText;
        oldGeneral.mailText = newGeneral.mailText;
        oldGeneral.webAdress = newGeneral.webAdress;
        oldGeneral.address = newGeneral.address;
        oldGeneral.addressText = newGeneral.addressText;
        oldGeneral.workingHours = newGeneral.workingHours;
        oldGeneral.workingHoursText = newGeneral.workingHoursText;



        const result = await oldGeneral.save();

        res.status(200).json({ message: 'Blog updated!', general: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('generalController', 'putUpdateGeneral', 239, 500, err);

        next(err);
    }
};



exports.deleteGeneral = async (req, res, next) => {
    const generalId = req.params.generalId;
    try {
        const general = await General.findById(generalId);

        if (!blog) {
            const error = new Error('Could not find blog.');
            error.statusCode = 404;
            throw error;
        }


        await General.findByIdAndRemove(generalId);

        res.status(200).json({ message: 'Deleted general.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('generalController', 'deleteGeneral', 377, 500, err);

        next(err);
    }
};
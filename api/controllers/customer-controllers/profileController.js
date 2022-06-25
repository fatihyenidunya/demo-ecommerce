
const { validationResult } = require('express-validator/check');
const Contact = require('../../models/contact');

const IndividualCustomer = require('../../models/individualCustomer');
const { mongoose } = require('mongoose');
const errorService = require('../../classes/errorService');

exports.getContacts = async (req, res, next) => {
    const customerId = req.params.id


    let totalItems;

    try {

        const contacts = await Contact
            .find({ 'customer': customerId })
            .exec()
        // .skip((currentPage - 1) * perPage)
        // .limit(perPage);

        console.log(contacts)
        res.status(200).json({
            message: 'Fetched customer cart succesfully',
            contacts: contacts,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('profileController', 'getContacts', 9, 500, err);

        next(err);
    }

}


exports.getProfile = async (req, res, next) => {
    const id = req.params.id




    try {

        const profile = await IndividualCustomer
            .findById(id);




        res.status(200).json({
            message: 'Fetched customer cart succesfully',
            profile: profile,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('profileController', 'getProfile', 42, 500, err);
        next(err);
    }

}



exports.putUpdateProfile = async (req, res, next) => {
    const customerId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }




    const name = req.body.name;
    const surname = req.body.surname;
    const company = req.body.company;
    const email = req.body.email;
    const phone = req.body.phone;
    const tcId = req.body.tcId;
    const taxPlace = req.body.taxPlace;
    const taxNo = req.body.taxNo;


    const newIndividualCustomer = new IndividualCustomer({
        name: name,
        surname: surname,
        email: email,
        phone: phone,
        company: company,
        tcId: tcId,
        taxPlace: taxPlace,
        taxNo: taxNo

    });

    try {
        const oldIndividualCustomer = await (await IndividualCustomer.findById(customerId));
        if (!oldIndividualCustomer) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }




        oldIndividualCustomer.name = newIndividualCustomer.name;
        oldIndividualCustomer.surname = newIndividualCustomer.surname;
        oldIndividualCustomer.email = newIndividualCustomer.email;
        oldIndividualCustomer.phone = newIndividualCustomer.phone;
        oldIndividualCustomer.company = newIndividualCustomer.company;
        oldIndividualCustomer.tcId = newIndividualCustomer.tcId;
        oldIndividualCustomer.taxNo = newIndividualCustomer.taxNo;
        oldIndividualCustomer.taxPlace = newIndividualCustomer.taxPlace;



        const result = await oldIndividualCustomer.save();

        res.status(200).json({ message: 'Product updated!', profile: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('profileController', 'putUpdateProfile', 74, 500, err);
        next(err);
    }
};

exports.getContact = async (req, res, next) => {
    const id = req.params.id




    try {

        const contact = await Contact
            .findById(id);
        console.log(contact)


        res.status(200).json({
            message: 'Fetched customer cart succesfully',
            contact: contact,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('profileController', 'getContact', 143, 500, err);
        next(err);
    }

}

exports.getCustomerInfo = async (req, res, next) => {
    const id = req.params.id


    const buyer = {
        id: '',
        name: '',
        surname: '',
        gsmNumber: '',
        email: '',
        identityNumber: '',
        lastLoginDate: '',
        registrationDate: '',
        registrationAddress: '',
        ip: '',
        city: '',
        country: '',
        zipCode: ''
    };

    try {

        const individualCustomer = await IndividualCustomer
            .findById(id);

        const contact = await Contact.find({})



        res.status(200).json({
            message: 'Fetched customer cart succesfully',
            registrationDate: individualCustomer.createdAt,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('profileController', 'getCustomerInfo', 172, 500, err);
        next(err);
    }

}


exports.postContact = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }




    const customer = req.body.customerId;
    const addressName = req.body.addressName;
    const name = req.body.name;
    const lastName = req.body.lastName;
    const identityNumber = req.body.identityNumber;
    const email = req.body.email;
    const phone = req.body.phone;
    const company = req.body.company;
    const addressOne = req.body.addressOne;
    const taxPlace = req.body.taxPlace;
    const taxNo = req.body.taxNo;
    const zipCode = req.body.zipCode;
    const city = req.body.city;
    const countryCode = req.body.countryCode;
    const country = req.body.country;
    const state = req.body.state;


    try {


        const contact = new Contact({
            customer: customer,
            addressName: addressName,
            name: name,
            lastName: lastName,
            identityNumber: identityNumber,
            email: email,
            phone: phone,
            company: company,
            addressOne: addressOne,
            taxPlace: taxPlace,
            taxNo: taxNo,
            zipCode: zipCode,
            city: city,
            countryCode: countryCode,
            country: country,
            state: state


        });


        const result = await contact.save();

        console.log(result)


        res.status(201).json({ message: 'Added to Contact!', contact: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('profileController', 'postContact', 218, 500, err);
        next(err);
    }
}



exports.putUpdateContact = async (req, res, next) => {
    const contactId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }


    const customer = req.body.customerId;
    const addressName = req.body.addressName;
    const name = req.body.name;
    const lastName = req.body.lastName;
    const identityNumber = req.body.identityNumber;
    const email = req.body.email;
    const phone = req.body.phone;
    const company = req.body.company;
    const addressOne = req.body.addressOne;
    const taxPlace = req.body.taxPlace;
    const taxNo = req.body.taxNo;
    const zipCode = req.body.zipCode;
    const city = req.body.city;
    const countryCode = req.body.countryCode;
    const country = req.body.country;
    const state = req.body.state;


    const newContact = new Contact({
        customer: customer,
        addressName: addressName,
        name: name,
        lastName: lastName,
        identityNumber: identityNumber,
        email: email,
        phone: phone,
        company: company,
        addressOne: addressOne,
        taxNo: taxNo,
        taxPlace:taxPlace,
        zipCode: zipCode,
        city: city,
        countryCode: countryCode,
        country: country,
        state: state

    });

    try {
        const oldContact = await (await Contact.findById(contactId));
        if (!oldContact) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }



        oldContact.addressName = newContact.addressName;
        oldContact.name = newContact.name;
        oldContact.lastName = newContact.lastName;
        oldContact.identityNumber = newContact.identityNumber;
        oldContact.email = newContact.email;
        oldContact.phone = newContact.phone;
        oldContact.company = newContact.company;
        oldContact.addressOne = newContact.addressOne;
        oldContact.taxPlace = newContact.taxPlace;
        oldContact.taxNo = newContact.taxNo;
        oldContact.zipCode = newContact.zipCode;
        oldContact.city = newContact.city;
        oldContact.countryCode = newContact.countryCode;
        oldContact.country = newContact.country;
        oldContact.state = newContact.state;




        const result = await oldContact.save();

        res.status(200).json({ message: 'Product updated!', contact: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('profileController', 'putUpdateContact', 292, 500, err);
        next(err);
    }
};


exports.deleteContact = async (req, res, next) => {
    const customerId = req.params.customerId;
    const contactId = req.params.contactId;


    try {
        const contact = await Contact.find({ "customer": customerId, "_id": contactId });


        if (!contact) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        const result1 = await Contact.deleteOne({ "_id": contactId });

        // const result1 = await Contact.findByIdAndRemove(contact._id);

        const result = await Contact
            .find({ 'customer': customerId })
            .exec()


        res.status(200).json({ message: 'The product out of the cart.', contacts: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('profileController', 'deleteContact', 383, 500, err);
        next(err);
    }
};





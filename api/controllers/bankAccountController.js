const mongodb = require('mongodb');
const BankAccount = require('../models/bankAccount');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getAccounts = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);

    try {
        const totalAccount = await BankAccount.find().countDocuments();
        const accounts = await BankAccount.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched succesfully',
            accounts: accounts,
            totalAccount: totalAccount
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getAccount = (req, res, next) => {
    const accountId = req.params.accountId


    BankAccount
        .findById(accountId)
        .then(account => {

            if (!account) {

                const error = new Error('Could not find blog');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'Slider fetched.', account: account })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.postAddAccount = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const bankAccount = new BankAccount({

            bank: req.body.bank,
            branch: req.body.branch,
            accountNo: req.body.accountNo,
            currency: req.body.currency,
            ibanNo: req.body.ibanNo,
            swiftCode: req.body.swiftCode

        });
        const result = await bankAccount.save();
        res.status(201).json({ statusCode: 201, message: 'Account created!', accountId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateAccount = async (req, res, next) => {
    const accountId = req.params.accountId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }





    const newBankAccount = new BankAccount({
        bank: req.body.bank,
        branch: req.body.branch,
        accountNo: req.body.accountNo,
        currency: req.body.currency,
        ibanNo: req.body.ibanNo,
        swiftCode: req.body.swiftCode
    });




    try {
        const oldBankAccount = await (await BankAccount.findById(accountId));
        if (!oldBankAccount) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }


        oldBankAccount.bank = newBankAccount.bank;
        oldBankAccount.branch = newBankAccount.branch;
        oldBankAccount.accountNo = newBankAccount.accountNo;
        oldBankAccount.currency = newBankAccount.currency;
        oldBankAccount.ibanNo = newBankAccount.ibanNo;
        oldBankAccount.swiftCode = newBankAccount.swiftCode;

        const result = await oldBankAccount.save();

        res.status(200).json({ message: 'Account updated!', account: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteAccount = async (req, res, next) => {
    const accountId = req.params.accountId;
    try {
        const bankAccount = await BankAccount.findById(accountId);

        if (!bankAccount) {
            const error = new Error('Could not find blog.');
            error.statusCode = 404;
            throw error;
        }


        await BankAccount.findByIdAndRemove(accountId);

        res.status(200).json({ message: 'Deleted account.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
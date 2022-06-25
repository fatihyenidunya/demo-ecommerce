const mongodb = require('mongodb');
const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');
const ObjectId = mongodb.ObjectId;

exports.getUsers = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;


    try {

        const users = await User.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched users succesfully',
            users: users,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('userController', 'getUsers', 10, 500, err);

        next(err);
    }

}

exports.getUsersByRole = async (req, res, next) => {

    const role = req.params.role;
    const userName = req.params.username;


    try {

        // const users = await User.find({ 'role': role, 'userName': { "\$ne": userName } });
        // const users = await User.find({ 'role': role });

        const users = await User.find();

        res.status(200).json({
            message: 'Fetched users succesfully',
            users: users,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('userController', 'getUsersByRole', 40, 500, err);

        next(err);
    }

}

exports.getUser = (req, res, next) => {
    const userId = req.params.userId


    User
        .findById(userId)
        .then(user => {

            if (!user) {

                const error = new Error('Could not find custom');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'user fetched.', user: user })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('userController', 'getUser', 70, 500, err);

            next(err);

        });

}

exports.postAddUser = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {


        const hashedPw = await bcrypt.hash(req.body.password, 12);

        const user = new User({
            userName: req.body.userName,
            password: hashedPw,
            email: req.body.email,
            role: req.body.role
        });




        const result = await user.save();
        res.status(201).json({ statusCode: 201, message: 'User created!', userId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('userController', 'postAddUser', 102, 500, err);

        next(err);
    }
}

exports.login = (req, res, next) => {

    const email = req.body.email;




    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email couldnot be found');
                error.statusCode = 401;
                throw error;

            }

            loadedUser = user;
            return bcrypt.compare(password, user.password);

        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString(),
                },
                'secretyenidunya',
                { expiresIn: '12h' }

            );

            // req.session.isLoggedIn = true;
            // req.session.customerId = loadedUser._id;

            res.status(200).json({ token: token, userId: loadedUser._id.toString(), userName: loadedUser.userName, role: loadedUser.role })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('userController', 'login', 141, 500, err);

            next(err);
        });

}

exports.putUpdateUser = async (req, res, next) => {
    const userId = req.params.userId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const hashedPw = await bcrypt.hash(req.body.password, 12);

    const newUser = new User({
        userName: req.body.userName,
        password: hashedPw,
        email: req.body.email,
        role: req.body.role
    });


    try {
        const oldUser = await (await User.findById(userId));
        if (!oldUser) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        oldUser.userName = newUser.userName;
        oldUser.password = newUser.password;
        oldUser.email = newUser.email;
        oldUser.role = newUser.role;




        const result = await oldUser.save();

        res.status(200).json({ message: 'User updated!', user: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('userController', 'putUpdateUser', 197, 500, err);

        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }


        await User.findByIdAndRemove(userId);

        res.status(200).json({ message: 'Deleted user.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('userController', 'deleteUser', 246, 500, err);

        next(err);
    }
};



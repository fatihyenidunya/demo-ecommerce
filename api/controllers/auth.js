const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const errorService = require('../classes/errorService');

exports.signup = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
 

    try {

        const hashedPw = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPw,
            name: name,
        
        });
        const result = await user.save();
        res.status(201).json({ message: 'User created!', userId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('auth', 'signup', 8, 500, err);
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
                    userId: loadedUser._id.toString()
                },
                'secretyenidunya',
                { expiresIn: '10h' }

            );
            res.status(200).json({ token: token, userId: loadedUser._id.toString() })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('auth', 'login', 45, 500, err);
            next(err);
        });

}
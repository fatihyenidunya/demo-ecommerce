const mongodb = require('mongodb');
const Role = require('../models/userRole');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;
const errorService = require('../classes/errorService');

exports.getRoles = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;


    try {

        const roles = await Role.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched users succesfully',
            roles: roles,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('userRoleController', 'getRoles', 10, 500, err);

        next(err);
    }

}

exports.getRole = (req, res, next) => {
    const roleId = req.params.roleId
    Role
        .findById(roleId)
        .then(userRole => {

            if (!userRole) {

                const error = new Error('Could not find custom');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'user fetched.', userRole: userRole })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('userRoleController', 'getRole', 40, 500, err);

            next(err);

        });

}

exports.postAddRole = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {


    

        const role = new Role({
            userRole: req.body.role
        });




        const result = await role.save();
        res.status(201).json({ statusCode: 201, message: 'Role created!', roleId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('userRoleController', 'postAddRole', 70, 500, err);

        next(err);
    }
}


exports.putUpdateRole = async (req, res, next) => {
    const roleId = req.params.roleId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

  

    const newRole = new Role({
     
        userRole: req.body.role
    });


    try {
        const oldRole = await (await Role.findById(roleId));
        if (!oldRole) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


   
        oldRole.userRole = newRole.userRole;


        const result = await oldRole.save();

        res.status(200).json({ message: 'Role updated!', userRole: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('userRoleController', 'putUpdateRole', 107, 500, err);

        next(err);
    }
};

exports.deleteRole = async (req, res, next) => {
    const roleId = req.params.roleId;
    try {
        const role = await Role.findById(roleId);

        if (!role) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }


        await Role.findByIdAndRemove(roleId);

        res.status(200).json({ message: 'Deleted role.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('userRoleController', 'deleteRole', 150, 500, err);

        next(err);
    }
};



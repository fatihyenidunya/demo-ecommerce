const mongodb = require('mongodb');
const Employee = require('../models/employee');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');

const ObjectId = mongodb.ObjectId;

exports.getEmployees = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await Employee.find().countDocuments();
        const employees = await Employee.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched customs succesfully',
            employees: employees,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getEmployee = (req, res, next) => {
    const employeeId = req.params.employeeId
    

    Employee
        .findById(employeeId)
        .then(employee => {

            if (!employee) {

                const error = new Error('Could not find employee');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'employee fetched.', employee: employee })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.postAddEmployee = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const employee = new Employee({
            name: req.body.name,
            role: req.body.role,
           
        });
        const result = await employee.save();
        res.status(201).json({ statusCode: 201, message: 'Employee created!', employeeId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putUpdateEmployee = async (req, res, next) => {
    const employeeId = req.params.employeeId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newEmployee = new Employee({
        name: req.body.name,
        role: req.body.role        
    });


    try {
        const oldEmployee = await (await Employee.findById(employeeId));
        if (!oldEmployee) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


       oldEmployee.name = newEmployee.name;
       oldEmployee.role = newEmployee.role;
       



        const result = await oldEmployee.save();

        res.status(200).json({ message: 'Custom updated!', custom: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteEmployee = async (req, res, next) => {
    const employeeId = req.params.employeeId;
    try {
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        await Employee.findByIdAndRemove(employeeId);

        res.status(200).json({ message: 'Deleted custom.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
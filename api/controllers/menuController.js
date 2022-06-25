const mongodb = require('mongodb');
const Menu = require('../models/menu');
const RoleMenu = require('../models/roleMenu');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');
const ObjectId = mongodb.ObjectId;

exports.getMenus = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;


    try {

        const menus = await Menu.find();


        res.status(200).json({
            message: 'Fetched menu succesfully',
            menus: menus

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('menuController', 'getMenus', 10, 500, err);

        next(err);
    }

}

exports.getMenu = async (req, res, next) => {

    const menuId = req.params.menuId;


    try {

        const menu = await Menu.findById(menuId);


        res.status(200).json({
            message: 'Fetched menu succesfully',
            menu: menu

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('menuController', 'getMenu', 39, 500, err);
        next(err);
    }

}

exports.getRoleMenus = async (req, res, next) => {

    const role = req.params.role;

    try {

        const menus = await RoleMenu.find({ role: role }).sort({ order: 1 });


        res.status(200).json({
            message: 'Fetched menu succesfully',
            menus: menus

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('menuController', 'getRoleMenus', 65, 500, err);

        next(err);
    }

}



exports.postAddMenu = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const menu = new Menu({
            link: '/' + req.body.link,
            icon: req.body.icon,
            name: req.body.name,
            hide: req.body.hide,

        });
        const result = await menu.save();
        res.status(201).json({ statusCode: 201, message: 'menu saved', menuId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('menuController', 'postAddMenu', 93, 500, err);

        next(err);
    }
}


exports.postRoleMenu = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {




        const menu = new RoleMenu({
            role: req.body.role,
            link: req.body.link,
            icon: req.body.icon,
            name: req.body.name,
            order: req.body.order


        });


        const menus = await RoleMenu.find({ role: menu.role, name: menu.name });

        if (menus.length == 0) {

            const result = await menu.save();
        } else {

            if (menu.role != 'Admin') {

                await RoleMenu.findOneAndRemove({ role: menu.role, name: menu.name });
            }


        }


        res.status(201).json({ statusCode: 201, message: 'menu saved' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('menuController', 'postRoleMenu', 129, 500, err);

        next(err);
    }
}


exports.putUpdateMenu = async (req, res, next) => {
    const menuId = req.params.menuId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const menu = new RoleMenu({
        role: req.body.role,
        link: req.body.link,
        icon: req.body.icon,
        name: req.body.name,
        order: req.body.order


    });



    try {
        const oldMenu = await (await Menu.findById(menuId));
        if (!oldMenu) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        oldMenu.role = menu.role;
        oldMenu.link = '/' + menu.link;
        oldMenu.icon = menu.icon;
        oldMenu.name = menu.name;
        oldMenu.order = menu.order;


        const result = await oldMenu.save();

        res.status(200).json({ message: 'Custom updated!', custom: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('menuController', 'putUpdateMenu', 184, 500, err);

        next(err);
    }
};

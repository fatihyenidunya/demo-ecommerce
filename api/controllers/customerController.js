const Customer = require('../models/customer');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const Category = require('../models/category');
const bcrypt = require('bcryptjs');
const Product = require('../models/product');
const Basket = require('../models/basket');
const Order = require('../models/order');
const Location = require('../models/location');
const CustomerProductPrice = require('../models/customerProductPrice');
const product = require('../models/product');
const { mongoose } = require('mongoose');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

exports.getCustomers = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const customer = req.query.customer || '';
    const perPage = Number(pageSize);

    const userRole = req.query.userrole;
    const userName = req.query.username;

    let customerTxt = '';
    let ownerTxt = '';
    let queryTxt = "";
    if (customer != '') {
        if (customer != 'undefined') {
            customerTxt = '{"company":{ "\$regex" : "' + customer + '", "\$options" : "i"}}';
        }
    }
    if (userRole != 'Manager') {
        ownerTxt = '"owner":"' + userName + '"';
    }

    queryTxt = '{' + customerTxt + ownerTxt + '}';


    let query = JSON.parse(queryTxt);

    try {
        const totalCustomer = await Customer.find(query).countDocuments();


        const customers = await Customer.find(query)
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched customers succesfully',
            customers: customers,
            totalCustomer: totalCustomer
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


exports.getCustomer = (req, res, next) => {
    const customerId = req.params.customerId


    Customer
        .findById(customerId)
        .then(customer => {

            if (!customer) {

                const error = new Error('Could not find customerrrr');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'customer fetched.', customer: customer })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}

exports.putUpdateCustomer = async (req, res, next) => {
    const customerId = req.params.customerId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const newCustomer = new Customer({

        company: req.body.company,
        email: req.body.email,
        password: req.body.password,
        country: req.body.country,
        address: req.body.address,
        phone: req.body.phone,
        fax: req.body.fax,
        taxId: req.body.taxId,
        officer: req.body.officer,
        owner: req.body.owner,
        ownerRole: req.body.ownerRole
    });


    const hashedPw = await bcrypt.hash(newCustomer.password, 12);


    try {
        const oldCustomer = await (await Customer.findById(customerId));
        if (!oldCustomer) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        oldCustomer.company = newCustomer.company,
            oldCustomer.email = newCustomer.email,
            oldCustomer.password = hashedPw,
            oldCustomer.country = newCustomer.country,
            oldCustomer.address = newCustomer.address,
            oldCustomer.phone = newCustomer.phone,
            oldCustomer.fax = newCustomer.fax,
            oldCustomer.taxId = newCustomer.taxId,
            oldCustomer.officer = newCustomer.officer,
            oldCustomer.owner = newCustomer.owner
        oldCustomer.ownerRole = newCustomer.ownerRole

        const result = await oldCustomer.save();

        res.status(200).json({ message: 'Custom updated!', customer: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};



exports.deleteCustomer = async (req, res, next) => {
    const customerId = req.params.customerId;
    try {
        const customer = await Customer.findById(customerId);

        if (!customer) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        await Customer.findByIdAndRemove(customerId);

        res.status(200).json({ message: 'Deleted customer.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.addCustomer = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const company = req.body.company;
    const email = req.body.email;
    const password = req.body.password;
    const country = req.body.country;
    const address = req.body.address;
    const phone = req.body.phone;
    const fax = req.body.fax;
    const taxId = req.body.taxId;
    const officer = req.body.officer;
    const owner = req.body.owner;
    const ownerRole = req.body.ownerRole;
    try {

        const hashedPw = await bcrypt.hash(password, 12);

        const customer = new Customer({
            email: email,
            password: hashedPw,
            company: company,
            country: country,
            address: address,
            phone: phone,
            fax: fax,
            taxId: taxId,
            officer: officer,
            owner: owner,
            ownerRole: ownerRole
        });
        const result = await customer.save();


        const products = (await Product.find()).forEach(p => {


            const customerProductPrice = new CustomerProductPrice({
                customer: result._id,
                productId: p._id,
                productTitle: p.title,
                productTurkishTitle: p.turkishTitle,
                unitPrice: p.unitPrice,
                currency: p.currency,
                order: p.order
            })
           

            const result1 = customerProductPrice.save();
           

        });





        res.status(201).json({ message: 'Customer created!', customerId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getChangeCustomerOwner = async (req, res, next) => {
    const customerId = ObjectId(req.params.customerId);
    const userName = req.params.username;




    try {


        const result = await Customer.updateOne({ _id: customerId }, { owner: userName });


        res.status(200).json({
            message: 'customer owner changed'

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getCustomerProductPrices = (req, res, next) => {
    const customerId = req.params.customerId;

    CustomerProductPrice
        .find({ 'customer': customerId })
        .populate({ path: 'productId', select: 'title turkishTitle imageUrl stock volume volumeEntity quantityInBox grossWeight grossEntity boxWidth boxLength boxHeight boxEntity emptyBoxWeight categoryNameLower categoryName image' })
        .sort({ order: 1 })
        .exec()
        .then(products => {


            if (!products) {

                const error = new Error('Could not find customer product prices');
                err.statusCode = 404;
                throw error;
            }



            res.status(200).json({ message: 'customer fetched.', products: products })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            next(err);

        });

}


exports.getProductsByTopCategoryForDealer = async (req, res, next) => {


    const topCategory = req.params.topCategory;
    const customerId = req.params.customerId;




    try {

        const categor = await Category.find({ nameLower: topCategory });
        const subCategories = await Category.find({ topCategoryNameLower: topCategory });


        const categories = [];

        if (subCategories.length != 0) {
            for (let c of subCategories) {
                console.log(customerId)
                let category = {
                    name: {},
                    products: []
                }
                category.name = c.name;

                const products = await CustomerProductPrice
                    .find({ 'customer': customerId })
                    .populate({ path: 'productId', select: 'title categoryId image stock volume volumeEntity quantityInBox grossWeight grossEntity boxWidth boxLength boxHeight boxEntity' })
                    .exec()
                    .then(products => {
                        products.forEach(e => {
                            if (e.productId.categoryId.toString() == c._id.toString()) {
                                category.products.push(e);
                            }
                        })
                    })
                categories.push(category);
            }
        } else {

            let category = {
                name: {},
                products: []
            }
            category.name = categor[0].name;

            const products = await CustomerProductPrice
                .find({ 'customer': customerId })
                .populate({ path: 'productId', select: 'title categoryId image stock volume volumeEntity quantityInBox grossWeight grossEntity boxWidth boxLength boxHeight boxEntity' })
                .exec()
                .then(products => {
                    products.forEach(e => {
                        if (e.productId.categoryId.toString() == categor[0]._id.toString()) {
                            category.products.push(e);
                        }
                    })
                })
            categories.push(category);

        }


        console.log(categories)



        res.status(200).json({
            message: 'Fetched products succesfully',
            categories: categories,
            categoryTitle: categor[0].title,
            categoryMetaDescription: categor[0].metaDescription

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getCustomerProductCurrency = async (req, res, next) => {
    const customerId = req.params.customerId;
    const currency = req.params.currency;

    const products = await CustomerProductPrice
        .find({ 'customer': customerId });
    if (!products) {
        const error = new Error('Could not find customer product prices');
        err.statusCode = 404;
        throw error;
    }

    products.forEach(t => {
        t.currency = currency;
        t.save();
    });




    res.status(200).json({ message: 'customer fetched.' })





}

exports.updatecustomerproductprice = async (req, res, next) => {
    const customerId = req.params.customerId;
    const _id = req.params._id;
    const unitPrice = req.params.unitPrice;
    const currency = req.params.currency;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const newCustomerProductPrice = new CustomerProductPrice({

        unitPrice: req.params.unitPrice,
        currency: req.params.currency
    });



    try {
        const oldCustomerProductPrice = await (await CustomerProductPrice.findById(_id));
        if (!oldCustomerProductPrice) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        oldCustomerProductPrice.unitPrice = newCustomerProductPrice.unitPrice,
            oldCustomerProductPrice.currency = newCustomerProductPrice.currency



        const result = await oldCustomerProductPrice.save();

        res.status(200).json({ message: 'Product Price updated!', price: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getMyOrders = async (req, res, next) => {
    const customerId = req.params.customerId

    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {

        const orders = await Order
            .find({ 'customerId': customerId })
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });



        res.status(200).json({
            message: 'Fetched customer order products succesfully',
            orders: orders,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.login = (req, res, next) => {

    console.log(req.body);


    const email = req.body.email;

    const password = req.body.password;

    let loadedUser;
    Customer.findOne({ email: email })
        .then(customer => {
            if (!customer) {
                const error = new Error('A customer with this email couldnot be found');
                error.statusCode = 401;
                throw error;

            }

            loadedUser = customer;
            return bcrypt.compare(password, customer.password);

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
                    customerId: loadedUser._id.toString(),
                },
                'secretyenidunya',
                { expiresIn: '1h' }

            );

            // req.session.isLoggedIn = true;
            // req.session.customerId = loadedUser._id;

            console.log(token)
            console.log(loadedUser)
            res.status(200).json({
                token: token, customerId: loadedUser._id.toString(), company: loadedUser.company, country: loadedUser.country, owner: loadedUser.owner
            })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}


exports.getProducts = async (req, res, next) => {


    const customerId = req.params.customerId;

    console.log(customerId)

    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {

        const products = await CustomerProductPrice
            .find({ 'customer': customerId })
            .populate({ path: 'productId', select: 'title image order stock volume volumeEntity quantityInBox grossWeight grossEntity boxWidth boxLength boxHeight boxEntity emptyBoxWeight categoryNameLower categoryName' })
            .sort({ order: 1 })
            .exec()
        // .skip((currentPage - 1) * perPage)
        // .limit(perPage);

        console.log(products[0]);
        res.status(200).json({
            message: 'Fetched customer products succesfully',
            products: products,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}




exports.getProduct = async (req, res, next) => {
    const customerId = req.params.customerId
    const productId = req.params.productId

    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {

        console.log(productId);
        const product = await CustomerProductPrice
            .find({ 'customer': customerId, 'productId': productId })
            .populate({ path: 'productId', select: 'title imageUrl stock volume volumeEntity quantityInBox grossWeight grossEntity boxWidth boxLength boxHeight boxEntity' })
            .exec()
        // .skip((currentPage - 1) * perPage)
        // .limit(perPage);

        console.log(product);
        res.status(200).json({
            message: 'Fetched customer products succesfully',
            product: product[0],

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getBasketProducts = async (req, res, next) => {
    const customerId = req.params.customerId

    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {

        const products = await Basket
            .find({ 'customer': customerId })
            .populate({ path: 'product', select: '_id title turkishTitle imageUrl stock volume volumeEntity quantityInBox grossWeight grossEntity boxWidth boxLength boxHeight boxEntity emptyBoxWeight categoryNameLower categoryName' })
            .exec()
        // .skip((currentPage - 1) * perPage)
        // .limit(perPage);

        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            products: products,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}



exports.addToBasket = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }


    const customer = req.body.customerId;
    const product = req.body.productId;
    const unitPrice = req.body.unitPrice;
    const unit = req.body.unit;
    const box = req.body.box;
    const totalPrice = req.body.totalPrice.toFixed(2);
    const currency = req.body.currency;
    const country = req.body.country;
    const totalVolume = req.body.totalVolume;

    try {


        const basketProduct = await Basket
            .find({ 'customer': customer, 'product': product }).exec();



        if (basketProduct.length != 0) {



            basketProduct[0].unit += unit;
            basketProduct[0].box += box;
            basketProduct[0].totalPrice += totalPrice;
            basketProduct[0].totalVolume += totalVolume;
            basketProduct[0].totalPrice = basketProduct[0].totalPrice.toFixed(2);
            const result = await basketProduct[0].save();
        }
        else {

            const basket = new Basket({
                customer: customer,
                product: product,
                unitPrice: unitPrice,
                unit: unit,
                box: box,
                totalPrice: totalPrice,
                totalVolume: totalVolume,
                currency: currency,
                country: country
            });


            const result = await basket.save();


        }


        res.status(201).json({ message: 'Added to basket!', productId: product });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getShowBasket = async (req, res, next) => {
    const customerId = req.params.customerId

    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {

        const products = await Basket
            .find({ 'customer': customerId }, { product: 1, totalVolume: 1, unitPrice: 1, readyBox: 1, readyUnit: 1, stock: 1, status: 1, box: 1, unit: 1, totalPrice: 1, currency: 1, createdAt: 1, _id: 0 })
            .populate({ path: 'product', select: 'title turkishTitle image volume volumeEntity quantityInBox grossWeight grossEntity boxWidth boxLength boxHeight boxEntity emptyBoxWeight categoryNameLower categoryName' })
            .exec()
        // .skip((currentPage - 1) * perPage)
        // .limit(perPage);



        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            products: products,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


exports.outofbasket = async (req, res, next) => {
    const customerId = req.params.customerId;
    const productId = req.params.productId;

    console.log('customerId :' + customerId)
    console.log('productId :' + productId)
    try {
        const product = await Basket.find({ "customer": customerId, "product": productId });


        if (!product) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        await Basket.deleteOne({ "customer": customerId, "product": productId });

        const result = await Basket
            .find({ 'customer': customerId })
            .populate({ path: 'product', select: 'title image stock volume volumeEntity quantityInBox grossWeight grossEntity boxWidth boxLength boxHeight boxEntity emptyBoxWeight' })
            .exec()
        console.log(result)

        res.status(200).json({ message: 'The product out of the cart.', products: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.deleteCustomerProduct = async (req, res, next) => {
    const id = req.params.id;


    console.log('_id :' + id)

    try {
        const product = await CustomerProductPrice.findById(id);


        if (!product) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        await CustomerProductPrice.findByIdAndDelete(id);


        res.status(200).json({ message: 'The product deleted.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};


exports.newAddress = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const customerId = req.body.customerId;
    const name = req.body.name;
    const country = req.body.country;

    const fax = req.body.fax;
    const address = req.body.address;
    const taxId = req.body.taxId;
    const phone = req.body.phone;
    const email = req.body.email;
    const officer = req.body.officer;



    const location = new Location({

        customerId: customerId,
        name: name,
        country: country,
        fax: fax,
        phone: phone,
        email: email,
        officer: officer,
        address: address,
        taxId: taxId
    });





    try {


        const result = await location.save();





        res.status(201).json({ message: 'Location saved!', locations: result });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.addCustomerProduct = async (req, res, next) => {

    const customerId = req.body.customerId;
    const productId = req.body.productId;
    const order = req.body.order;
    const unitPrice = req.body.unitPrice;
    const currency = req.body.currency;



    try {


        const customerProductPrice = new CustomerProductPrice({
            customer: customerId,
            productId: productId,
            unitPrice: unitPrice,
            currency: currency,
            order: order
        })



        const result1 = await customerProductPrice.save();

        res.status(201).json({ message: 'Product added!' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getCustomerAddresses = async (req, res, next) => {


    const customerId = req.params.customerId;

    const customer = await Customer.findById(customerId);



    try {

        const locations = await Location.find({ customerId: customerId });

        res.status(201).json({ message: 'Get addresses!', locations: locations, customer: customer.company, country: customer.country });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getCustomerAddress = async (req, res, next) => {


    const addressId = req.params.addressId;

    console.log(addressId)

    try {

        const location = await Location.findById(addressId);

        res.status(201).json({ message: 'Get addresses!', location: location });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.deleteCustomerAddress = async (req, res, next) => {
    const id = req.params.id;

    try {



        const result = await Location.findByIdAndDelete(id);


        res.status(200).json({ message: 'Deleted customer.', locations: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateCustomerAddress = async (req, res, next) => {
    const id = req.params.id;



    try {
        const location = await Location.findById(id);


        location.name = req.body.name,
            location.country = req.body.country,
            location.fax = req.body.fax,
            location.address = req.body.address,
            location.taxId = req.body.taxId,
            location.phone = req.body.phone,
            location.email = req.body.email,
            location.officer = req.body.officer

        const result = await location.save();


        res.status(200).json({ message: 'Deleted location.', locations: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

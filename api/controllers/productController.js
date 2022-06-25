const mongodb = require('mongodb');
const Product = require('../models/product');
const ProductStockLog = require('../models/productStockLog');
const ProductShipmentLog = require('../models/productShipmentLog');
const Category = require('../models/category');
const Comment = require('../models/comment');
const nodemailer = require('nodemailer');
const Customer = require('../models/customer');
const CustomerProductPrice = require('../models/customerProductPrice');
const { validationResult } = require('express-validator/check');
const ProductCountryPrice = require('../models/productCountryPrice');
const fileHelper = require('../utils/file');
const errorService = require('../classes/errorService');
const ObjectId = mongodb.ObjectId;

exports.getProductList = async (req, res, next) => {


  const currentPage = req.query.page || 1;
  const pageSize = req.query.pagesize;
  const product = req.query.product || '';
  const perPage = Number(pageSize);


  let productTxt = '{}';

  if (product != '') {
    if (product != 'undefined') {
      productTxt = '{"title":{ "\$regex" : "' + product + '", "\$options" : "i"}}';
    }
  }

  let query = JSON.parse(productTxt);


  try {
    const totalProduct = await Product.find(query).countDocuments();
    const products = await Product.find(query)
      .skip((currentPage - 1) * perPage)
      .limit(perPage).sort({ order: 1 });

    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      totalProduct: totalProduct
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProductList', 16, 500, err);

    next(err);
  }

}

exports.getProductStock = async (req, res, next) => {


  const currentPage = req.query.page || 1;
  const pageSize = req.query.pagesize;
  const perPage = Number(pageSize);



  try {
    const totalProduct = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage).sort({ stock: 1 });

    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      totalProduct: totalProduct
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProductStock', 59, 500, err);

    next(err);
  }

}

exports.getFindCustomerProducts = async (req, res, next) => {



  const customerId = req.query.customerid;
  const product = req.query.product || '';




  let productTxt = '{}';

  if (product != '') {
    if (product != 'undefined') {
      productTxt = '{"customer":"' + ObjectId(customerId) + '" ,"productTitle":{ "\$regex" : "' + product + '", "\$options" : "i"}}';
    }
  }


  try {
    const totalProduct = await CustomerProductPrice.find(query).countDocuments();
    const products = await CustomerProductPrice.find(query);



    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      totalProduct: totalProduct
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getFindCustomerProducts', 91, 500, err);

    next(err);
  }

}



exports.getFindProductViaBarcode = async (req, res, next) => {



  const barcode = req.query.barcode;

  console.log(barcode);


  try {
    const totalProduct = await Product.find({ barcode: barcode }).countDocuments();
    const products = await Product.find({ barcode: barcode });



    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      totalProduct: totalProduct
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getFindProductViaBarcode', 135, 500, err);

    next(err);
  }

}

exports.getProducts = async (req, res, next) => {


  try {
    const totalProduct = await Product.find().countDocuments();
    const products = await Product.find();

    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      totalProduct: totalProduct
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProducts', 133, 500, err);

    next(err);
  }

}

exports.getProductForVolume = async (req, res, next) => {


  const volume = req.params.volume;


  let totalProduct;
  let products;



  try {


    if (volume !== 'All') {
      totalProduct = await Product.find({ volume: volume }).countDocuments();
      products = await Product.find({ volume: volume }).sort({ order: 1 });

    } else {
      totalProduct = await Product.find().countDocuments();
      products = await Product.find().sort({ order: 1 });
    }



    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      totalProduct: totalProduct
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProductForVolume', 157, 500, err);

    next(err);
  }

}


exports.getCustomerProductSearch = async (req, res, next) => {



  const product = req.query.product || '';



  let productTxt = '{}';

  if (product != '') {
    if (product != 'undefined') {
      productTxt = '{"title":{ "\$regex" : "' + product + '", "\$options" : "i"}}';
    }
  }

  let query = JSON.parse(productTxt);


  try {

    const products = await Product.find(query);


    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      totalProduct: totalProduct
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getCustomerProductSearch', 200, 500, err);

    next(err);
  }

}



exports.getProductsForMobile = async (req, res, next) => {





  const currentPage = req.query.page || 1;
  const perPage = 200;
  let totalItems;

  try {

    const products = await Product.find();



    // console.log(products);
    res.status(200).json({
      message: 'Fetched customer products succesfully',
      products: products,

    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProductsForMobile', 243, 500, err);

    next(err);
  }

}

exports.getProductLatests = async (req, res, next) => {

  const country = req.params.country;



  try {

    let prods = [];
    a = 0;

    let products = [];

    // const _products = await Product.find().sort({ createdAt: -1 })
    //   .limit(28);



    const _products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(28)
      .exec();





    for (let p of _products) {


      if (a % 4 == 0) {
        products.push(prods);

        prods = [];

      }

      prods.push(p);


      a++;

    }


    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products.splice(1, 7)

    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProductLatests', 277, 500, err);

    next(err);
  }

}


exports.getCategoryProducts = async (req, res, next) => {

  const category = req.params.category;



  try {
    const totalProduct = await Product.find({ categoryNameLower: category }).countDocuments();
    const products = await Product.find({ categoryNameLower: category }).sort({ cteatedAt: -1 })




    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      totalProduct: totalProduct
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getCategoryProducts', 340, 500, err);

    next(err);
  }

}

exports.getSearchResult = async (req, res, next) => {

  const text = req.params.text;




  try {



    const totalProduct = await Product.find({ $text: { $search: text } }).countDocuments();
    const products = await Product.find({ $text: { $search: text } }).sort({ cteatedAt: -1 })
      .limit(8);

    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      totalProduct: totalProduct
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getSearchResult', 370, 500, err);

    next(err);
  }

}

exports.getProductsByCategoryId = async (req, res, next) => {

  const categoryId = req.params.categoryId;



  try {
    const totalProduct = await Product.find({ categoryId: categoryId }).countDocuments();
    const products = await Product.find({ categoryId: categoryId }).sort({ cteatedAt: -1 });


    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      totalProduct: totalProduct
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProductsByCategoryId', 402, 500, err);

    next(err);
  }

}


exports.getProductsByTopCategory = async (req, res, next) => {

  const country = req.params.country;
  const topCategory = req.params.topCategory;



  try {

    const categor = await Category.find({ nameLower: topCategory });
    const subCategories = await Category.find({ topCategoryNameLower: topCategory });



    const categories = [];

    let category = {
      name: {},
      nameLower: {},
      isTopCategory: {},
      topCategoryNameLower: {},
      products: []
    }

    category.name = categor[0].name;
    category.nameLower = categor[0].nameLower;
    category.isTopCategory = categor[0].isTopCategory;
    category.topCategoryName = categor[0].topCategoryName;
    category.topCategoryNameLower = categor[0].topCategoryNameLower;


    if (subCategories.length === 0) {

      const prices = Product.find({ categoryNameLower: topCategory })
        .sort({ order: 1 })
        .exec().then(products => {

          category.products = products



          res.status(200).json({
            message: 'Fetched products succesfully',
            categories: categories,
            categoryTitle: categor[0].title,
            categoryMetaDescription: categor[0].metaDescription

          })

        });

    }



    if (subCategories.length != 0) {

      for (let _category of subCategories) {

        const products = await Product.find({ categoryId: _category._id });

        for (let p of products) {

          category.products.push(p);
        }


      }


      categories.push(category);

      res.status(200).json({
        message: 'Fetched products succesfully',
        categories: categories,
        categoryTitle: categor[0].title,
        categoryMetaDescription: categor[0].metaDescription

      })

    }








    // if (subCategories.length != 0) {
    //   for (let c of subCategories) {

    //     let category = {
    //       name: {},
    //       products: []
    //     }
    //     category.name = c.name;

    //     let products = await Product.find({ categoryId: c._id }).sort({ createdAt: -1 });
    //     category.products.push(products);

    //     categories.push(category);



    //   }
    // }
    // else {


    //   let category = {
    //     name: {},
    //     products: []
    //   }
    //   category.name = categor[0].name;

    //   let products = await Product.find({ categoryId: categor[0]._id }).sort({ createdAt: -1 });
    //   category.products.push(products);

    //   categories.push(category);

    //   console.log(categor[0].name + ' ' + categor[0]._id);

    // }





    // res.status(200).json({
    //   message: 'Fetched products succesfully',
    //   categories: categories,
    //   categoryTitle: categor[0].title,
    //   categoryMetaDescription: categor[0].metaDescription

    // })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProductsByTopCategory', 431, 500, err);

    next(err);
  }

}

exports.getProductsByTopCategoryForMobile = async (req, res, next) => {

  const topCategory = req.params.topCategory;

  try {

    const categor = await Category.find({ nameLower: topCategory });
    const subCategories = await Category.find({ topCategoryNameLower: topCategory });

    const _products = [];
    const products = [];

    if (subCategories.length != 0) {
      for (let c of subCategories) {

        let product = await Product.find({ categoryId: c._id }).sort({ createdAt: -1 });


        _products.push(product);

      }
    }
    else {

      let product = await Product.find({ categoryId: categor[0]._id }).sort({ createdAt: -1 });
      _products.push(product);

    }


    for (let p of _products) {

      p.forEach(c => {
        products.push(c);
      })

    }



    res.status(200).json({
      message: 'Fetched products succesfully',
      products: products,
      categoryTitle: categor[0].turkishName
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProductsByTopCategoryForMobile', 579, 500, err);

    next(err);
  }

}


exports.getProduct = async (req, res, next) => {


  const productId = req.params.productId


  // const colors = [];
  // let newColor = {
  //   color: 'Renk Seçiniz'
  // };
  // colors.push(newColor);
  // for (let c of product.color.split(',')) {
  //   let newColor = {
  //     color: {}
  //   };
  //   newColor.color = c;
  //   colors.push(newColor);

  // }



  // const sizes = [];
  // let newSize = {
  //   size: 'Size Seçiniz'
  // };
  // sizes.push(newSize);
  // for (let s of product.size.split(',')) {
  //   let newSize = {
  //     size: {}
  //   };
  //   newSize.size = s;
  //   sizes.push(newSize);

  // }

  try {

    const product = await Product.findById(productId);



    if (!product) {

      const error = new Error('Could not find product');
      err.statusCode = 404;
      throw error;
    }


    // console.log(product);

    const productHistory = await ProductStockLog.find({ productId: productId }).sort({ createdAt: -1 });

    const productShipmentHistory = await ProductShipmentLog.find({ productId: productId }).sort({ createdAt: -1 });





    res.status(200).json({ message: 'Product fetched.', product: product, productHistory: productHistory, productShipmentHistory: productShipmentHistory });


  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProduct', 637, 500, err);

    next(err);
  }




}


exports.getForIndividualProduct = async (req, res, next) => {


  const productId = req.params.productId;
  const country = req.params.country;

  // const colors = [];
  // let newColor = {
  //   color: 'Renk Seçiniz'
  // };
  // colors.push(newColor);
  // for (let c of product.color.split(',')) {
  //   let newColor = {
  //     color: {}
  //   };
  //   newColor.color = c;
  //   colors.push(newColor);

  // }



  // const sizes = [];
  // let newSize = {
  //   size: 'Size Seçiniz'
  // };
  // sizes.push(newSize);
  // for (let s of product.size.split(',')) {
  //   let newSize = {
  //     size: {}
  //   };
  //   newSize.size = s;
  //   sizes.push(newSize);

  // }

  try {


    const product = await Product.findById(productId);

    const category = await Category.findById(product.categoryId);



    res.status(200).json({
      message: 'Fetched products succesfully',
      product: product,
      category: category


    })

    //   res.status(200).json({ message: 'Product fetched.', product: product, productHistory: productHistory, productShipmentHistory: productShipmentHistory });


  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getForIndividualProduct', 715, 500, err);

    next(err);
  }




}

exports.getProductByTitle = (req, res, next) => {
  const title = req.params.title


  Product
    .find({ turkishTitleLower: title })
    .then(product => {

      if (!product) {

        const error = new Error('Could not find product');
        err.statusCode = 404;
        throw error;
      }
      console.log(product)

      res.status(200).json({ message: 'Product fetched.', product: product })

    })
    .catch(err => {

      if (!err.statusCode) {

        err.statusCode = 500;
      }
      errorService.sendErrorNotificationViaEmail('productController', 'getProductByTitle', 785, 500, err);

      next(err);

    });

}

exports.postAddProduct = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {

    // if (!req.file) {
    //   console.log(req.file);

    //   const error = new Error('No image provided.');
    //   error.statusCode = 422;
    //   throw error;
    // }
    // const imageUrl = req.file.path.replace("\\", "/");
    // console.log(imageUrl)



    const category = await Category.findById(req.body.categoryId);

    console.log("Addproduct")
    console.log(req.body.publish)


    const product = new Product({
      barcode: req.body.barcode,
      company: req.body.company,
      title: req.body.title,
      titleLower: req.body.title.toLowerCase().trimEnd().trimStart().replace(/ /g, '-').replace(/\(/g, '-').replace(/\)/g, '-').replace(/&/g, '').replace(/\//g, '-').replace(/'/g, '-').replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/\./g, '-').replace(/\,/g, '-'),
      description: req.body.description,
      metaDescription: req.body.title,
      mainPage: req.body.mainPage,
      categoryId: req.body.categoryId,
      categoryName: category.name,
      categoryNameLower: category.nameLower,
      publish: req.body.publish,
      order: req.body.order,

    });
    const result = await product.save();



    //  const customers = await Customer.find();


    // for (let c of customers) {

    //   const customerProductPrice = await CustomerProductPrice.find({ customer: c._id, productId: result._id });

    //   if (customerProductPrice.length === 0) {

    //     const customerProductPrice = new CustomerProductPrice({

    //       order: result.order,
    //       customer: c._id,
    //       productId: result._id,
    //       unitPrice: result.unitPrice,
    //       currency: result.currency

    //     });

    //     await customerProductPrice.save();

    //   }

    // }





    res.status(201).json({ statusCode: 201, message: 'Product created!', productId: result._id, productTitle: result.turkishTitle });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'postAddProduct', 818, 500, err);

    next(err);
  }
}

exports.postCopyProduct = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {



    const category = await Category.findById(req.body.categoryId);






    const product = new Product({
      barcode: req.body.barcode,
      company: req.body.company,
      title: req.body.title,
      titleLower: req.body.title.toLowerCase().trimEnd().trimStart().replace(/ /g, '-').replace(/\./g, '-').replace(/\(/g, '-').replace(/\)/g, '-').replace(/&/g, '').replace(/\//g, '-').replace(/'/g, '-').replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/\,/g, '-'),
      description: req.body.description,
      metaDescription: req.body.title,
      mainPage: req.body.mainPage,


      categoryId: req.body.categoryId,
      categoryName: category.name,
      categoryNameLower: category.nameLower,

      publish: req.body.publish,
      order: req.body.order,
      // freeCargo: req.body.freeCargo
    });


    // product.image.push(req.body.imageUrl);


    const result = await product.save();
    res.status(201).json({ statusCode: 201, message: 'Product created!', productId: result._id, productTitle: result.turkishTitle });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'postCopyProduct', 907, 500, err);

    next(err);
  }
}

exports.getProductStockLog = async (req, res, next) => {

  const productId = req.params.productId;



  try {

    const productStockLog = await ProductStockLog.find({ productId: productId });


    res.status(200).json({
      message: 'Fetched products succesfully',
      productStockLog: productStockLog

    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getProductStockLog', 963, 500, err);

    next(err);
  }

}

exports.postProductStockLog = async (req, res, next) => {

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed');
  //   error.statusCode = 422;
  //   error.data = errors.array();
  //   throw error;
  // }


  try {




    const productStockLog = new ProductStockLog({
      productId: req.body.productId,
      title: req.body.title,
      previousStock: req.body.previousStock,
      operation: req.body.operation,
      number: req.body.number,
      lastStock: req.body.lastStock,
      userName: req.body.userName,

    });
    const result = await productStockLog.save();





    res.status(201).json({ statusCode: 201 });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'postProductStockLog', 991, 500, err);

    next(err);
  }
}



exports.putUpdateStock = async (req, res, next) => {

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed');
  //   error.statusCode = 422;
  //   error.data = errors.array();
  //   throw error;
  // }

  let message;
  let closed;

  try {

    const productId = ObjectId(req.body.productId);

    const product = await Product.findById(productId);



    const stockCode = req.body.stockCode;
    const number = req.body.number;
    const variable = req.body.variable;


    let productStockLog = new ProductStockLog();


    productStockLog.title = product.title;
    productStockLog.userName = req.body.userName;
    productStockLog.operation = req.body.operation;

    productStockLog.productId = productId;
    productStockLog.number = Number(req.body.number);

    if (req.body.operation === "add") {
      if (product.colors.length !== 0) {
        for (let i of product.colors) {
          if (i.stockCode === stockCode) {
            let currentStock = Number(i.stock);
            productStockLog.variable = variable;
            productStockLog.volume = i.volume + ' ' + i.volumeEntity;
            productStockLog.previousStock = currentStock;
            currentStock += Number(req.body.number);
            productStockLog.lastStock = currentStock;
            i.stock = currentStock;
            const _product = await Product.findById(productId);
            _product.colors = product.colors;
            await _product.save();
          }
        }
      }

      if (product.sizes.length !== 0) {
        for (let i of product.sizes) {
          if (i.stockCode === stockCode) {
            let currentStock = Number(i.stock);
            productStockLog.variable = variable;
            productStockLog.volume = i.volume + ' ' + i.volumeEntity;
            productStockLog.previousStock = currentStock;
            currentStock += Number(req.body.number);
            productStockLog.lastStock = currentStock;
            i.stock = currentStock;
            const _product = await Product.findById(productId);
            _product.sizes = product.sizes;
            await _product.save();
          }
        }
      }


    } else {




      if (product.colors.length !== 0) {
        for (let i of product.colors) {
          if (i.stockCode === stockCode) {
            let currentStock = Number(i.stock);
            productStockLog.variable = variable;
            productStockLog.volume = i.volume + ' ' + i.volumeEntity;
            productStockLog.previousStock = currentStock;
            currentStock -= Number(req.body.number);
            productStockLog.lastStock = currentStock;
            i.stock = currentStock;
            const _product = await Product.findById(productId);
            _product.colors = product.colors;
            await _product.save();
          }
        }
      }

      if (product.sizes.length !== 0) {
        for (let i of product.sizes) {
          if (i.stockCode === stockCode) {
            let currentStock = Number(i.stock);
            productStockLog.variable = variable;
            productStockLog.volume = i.volume + ' ' + i.volumeEntity;
            productStockLog.previousStock = currentStock;
            currentStock -= Number(req.body.number);
            productStockLog.lastStock = currentStock;
            i.stock = currentStock;
            const _product = await Product.findById(productId);
            _product.sizes = product.sizes;
            await _product.save();
          }
        }
      }



    }




    await productStockLog.save();

    // if (product.stock >= 0) {
    //   const result = await product.save();
    //   message = 'Stock Updated!';
    //   closed = true;
    // }
    // else {
    //   message = 'Stok sıfırın altına inemez'
    //   closed = false;
    // }





    res.status(201).json({ statusCode: 201, message: message, closed: closed });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'putUpdateStock', 1037, 500, err);

    next(err);
  }
}

exports.putUpdateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }


  const category = await Category.findById(req.body.categoryId);

  const newProduct = new Product({
    barcode: req.body.barcode,
    company: req.body.company,
    title: req.body.title,
    titleLower: req.body.title.toLowerCase().trimEnd().trimStart().replace(/ /g, '-').replace(/\(/g, '-').replace(/\)/g, '-').replace(/&/g, '').replace(/\//g, '-').replace(/\./g, '-').replace(/'/g, '-').replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/\,/g, '-'),
    description: req.body.description,
    metaDescription: req.body.title,
    turkishDescription: req.body.turkishDescription,
    mainPage: req.body.mainPage,
    categoryId: req.body.categoryId,
    categoryName: category.name,
    categoryNameLower: category.nameLower,
    publish: req.body.publish,
    order: req.body.order
  });

  try {
    const oldProduct = await (await Product.findById(productId));
    if (!oldProduct) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    oldProduct.barcode = newProduct.barcode;
    oldProduct.company = newProduct.company;
    oldProduct.title = newProduct.title;
    oldProduct.titleLower = newProduct.titleLower;
    oldProduct.turkishTitle = newProduct.turkishTitle;
    oldProduct.turkishTitleLower = newProduct.turkishTitleLower;
    oldProduct.description = newProduct.description;
    oldProduct.metaDescription = newProduct.metaDescription;
    oldProduct.mainPage = newProduct.mainPage;
    oldProduct.turkishDescription = newProduct.turkishDescription;
    // oldProduct.imageUrl = newProduct.imageUrl;

    oldProduct.categoryId = newProduct.categoryId;
    oldProduct.categoryName = newProduct.categoryName;
    oldProduct.categoryNameLower = newProduct.categoryNameLower;

    oldProduct.publish = newProduct.publish;
    oldProduct.order = newProduct.order;

    const result = await oldProduct.save();


    let customerId;

    // if (result.publish === false) {


    //   const customerProductPrices = await CustomerProductPrice.find({ productId: result._id });

    //   console.log(customerProductPrices)

    //   for (let c of customerProductPrices) {
    //     await CustomerProductPrice.findByIdAndDelete(c._id);
    //   }


    // } else {

    //   const customers = await Customer.find();

    //   for (let cust of customers) {


    //     const customerProductPrices = await CustomerProductPrice.find({ customer: cust._id, productId: result._id });

    //     if (customerProductPrices.length === 0) {


    //       const customerProductPrice = new CustomerProductPrice({

    //         order: result.order,
    //         customer: cust._id,
    //         productId: result._id,
    //         unitPrice: result.unitPrice,
    //         currency: result.currency

    //       });

    //       console.log(customerProductPrice)

    //       await customerProductPrice.save();

    //     }

    //   }



    // }



    res.status(200).json({ message: 'Product updated!', product: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'putUpdateProduct', 1183, 500, err);

    next(err);
  }
};


exports.putDeleteProductImage = async (req, res, next) => {
  const productId = req.params.productId;
  const imageIndex = req.body.imageIndex;



  try {
    const product = await (await Product.findById(productId));
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }


    product.image.splice(imageIndex, 1);


    const result = await product.save();

    console.log(result);

    res.status(200).json({ message: 'Product updated!', product: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'putDeleteProductImage', 1305, 500, err);

    next(err);
  }
};


exports.putUploadProductImage = async (req, res, next) => {
  const productId = req.params.productId;


  if (!req.file) {
    console.log(req.file);

    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\", "/");
  console.log(imageUrl)

  try {
    const product = await (await Product.findById(productId));
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }


    product.image.push(imageUrl);


    const result = await product.save();



    res.status(200).json({ message: 'Product updated!', product: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'putUploadProductImage', 1339, 500, err);

    next(err);
  }
};


exports.putUpdateColor = async (req, res, next) => {
  const productId = req.params.productId;

  const _color = JSON.parse(req.body.color);


  let result;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }



    for (let i of product.colors) {
      if (i.stockCode === _color.stockCode) {

        i.volume = _color.volume;
        i.volumeEntity = _color.volumeEntity;
        i.barberSellingPrice = _color.barberSellingPrice;
        i.barberSellingPriceCurrency = _color.barberSellingPriceCurrency;
        i.salePrice = _color.salePrice;
        i.salePriceCurrency = _color.salePriceCurrency;
        i.listPrice = _color.listPrice;
        i.listPriceCurrency = _color.listPriceCurrency;

        console.log(product.colors)
        const _product = await Product.findById(productId);
        _product.colors = product.colors;

        result = await _product.save();
      }
    }



    res.status(200).json({ message: 'Product updated!', product: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'putUpdateColor', 1381, 500, err);

    next(err);
  }
};


exports.putUpdateSize = async (req, res, next) => {
  const productId = req.params.productId;

  const _size = JSON.parse(req.body.size);


  let result;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }



    for (let i of product.sizes) {
      if (i.stockCode === _size.stockCode) {

        i.volume = _size.volume;
        i.volumeEntity = _size.volumeEntity;
        i.barberSellingPrice = _size.barberSellingPrice;
        i.barberSellingPriceCurrency = _size.barberSellingPriceCurrency;
        i.salePrice = _size.salePrice;
        i.salePriceCurrency = _size.salePriceCurrency;
        i.listPrice = _size.listPrice;
        i.listPriceCurrency = _size.listPriceCurrency;

        console.log(product.sizes)
        const _product = await Product.findById(productId);
        _product.sizes = product.sizes;

        result = await _product.save();
      }
    }



    res.status(200).json({ message: 'Product updated!', product: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'putUpdateSize', 1433, 500, err);

    next(err);
  }
};

exports.putDeleteColor = async (req, res, next) => {
  const productId = req.params.productId;

  const index = req.body.index;




  try {
    const product = await (await Product.findById(productId));
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    product.colors.splice(index, 1);
    product.colors = product.colors;
    const result = await product.save();



    res.status(200).json({ message: 'Product updated!', product: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'putDeleteColor', 1484, 500, err);

    next(err);
  }
};


exports.putUpdatePrice = async (req, res, next) => {
  const productId = req.params.productId;

  const size = JSON.parse(req.body.size);




  try {
    const product = await (await Product.findById(productId));
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }


    product.sizes.push(size);


    const result = await product.save();




    res.status(200).json({ message: 'Product updated!', product: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'putUpdatePrice', 1518, 500, err);

    next(err);
  }
};



exports.putSaveNewColor = async (req, res, next) => {
  const productId = req.params.productId;

  const color = JSON.parse(req.body.color);




  try {
    const product = await (await Product.findById(productId));
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }


    product.colors.push(color);


    const result = await product.save();



    res.status(200).json({ message: 'Product updated!', product: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'putSaveNewColor', 1556, 500, err);

    next(err);
  }
};


exports.putDeletePrice = async (req, res, next) => {
  const productId = req.params.productId;

  const index = req.body.index;




  try {
    const product = await (await Product.findById(productId));
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    product.sizes.splice(index, 1);
    product.sizes = product.sizes;
    const result = await product.save();



    res.status(200).json({ message: 'Product updated!', product: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'putDeletePrice', 1592, 500, err);

    next(err);
  }
};




exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }


    await Product.findByIdAndRemove(productId);



    const customers = await Customer.find();


    for (let c of customers) {
      await CustomerProductPrice.findOneAndDelete({ customer: c._id, productId: productId });
    }




    res.status(200).json({ message: 'Deleted product.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'deleteProduct', 1628, 500, err);

    next(err);
  }
};


exports.postNewComment = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {



    const comment = new Comment({
      productId: req.body.productId,
      customerId: req.body.customerId,
      comment: req.body.comment,
      ranking: req.body.ranking
    });

    const result = await comment.save();
    res.status(201).json({ statusCode: 201, message: 'Comment sended!', commentId: result._id });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'postNewComment', 1666, 500, err);

    next(err);
  }
}

exports.getComments = async (req, res, next) => {

  const productId = req.params.productId;

  try {

    const comments = await Comment.find({ productId: ObjectId(productId), publish: true }).sort({ createdAt: -1 })

    res.status(200).json({
      message: 'Fetched comments succesfully',
      comments: comments
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'getComments', 1700, 500, err);

    next(err);
  }

}


exports.countryProductPrice = async (req, res, next) => {

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed');
  //   error.statusCode = 422;
  //   error.data = errors.array();
  //   throw error;
  // }

  let _cargoFee;

  try {

    _cargoFee = req.body.cargoFee;





    const productId = ObjectId(req.body.productId);
    const product = req.body.product;
    const categoryNameLower = req.body.categoryNameLower;
    const listPrice = req.body.listPrice;
    const salePrice = req.body.salePrice;
    const currency = req.body.currency;
    const country = req.body.country;
    const order = req.body.order;
    const freeCargo = req.body.freeCargo;
    const mainPage = req.body.mainPage;
    const cargoFee = _cargoFee;

    const countryProductPrice = new ProductCountryPrice({
      productId: productId,
      country: country,
      title: product,
      currency: currency,
      listPrice: listPrice,
      salePrice: salePrice,
      categoryNameLower: categoryNameLower,
      order: order,
      freeCargo: freeCargo,
      cargoFee: _cargoFee,
      mainPage: mainPage
    });


    if (listPrice !== salePrice) {
      if (salePrice < listPrice) {

        countryProductPrice.discount = Number((listPrice - salePrice) / listPrice).toFixed(0);



      }
    }

    const result = await countryProductPrice.save();



    res.status(201).json({ statusCode: 201 });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'countryProductPrice', 1725, 500, err);

    next(err);
  }
}

exports.countryProductPrices = async (req, res, next) => {

  const productId = req.params.productId;


  try {

    const prices = await ProductCountryPrice.find({ productId: ObjectId(productId) })



    res.status(200).json({
      message: 'Fetched comments succesfully',
      prices: prices
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    errorService.sendErrorNotificationViaEmail('productController', 'countryProductPrices', 1798, 500, err);

    next(err);
  }
}


exports.countryPrice = async (req, res, next) => {

  const priceId = req.params.priceId;




  try {

    const price = await ProductCountryPrice.findById(priceId);


    res.status(200).json({
      message: 'Fetched comments succesfully',
      price: price
    })

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.deleteCountryPrice = async (req, res, next) => {
  const priceId = req.params.priceId;
  try {
    const price = await ProductCountryPrice.findById(priceId);

    if (!price) {
      const error = new Error('Could not find price.');
      error.statusCode = 404;
      throw error;
    }


    await ProductCountryPrice.findByIdAndRemove(priceId);



    res.status(200).json({ message: 'Deleted price.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.putCountryPrice = async (req, res, next) => {
  const priceId = req.params.priceId;


  const country = req.body.country;
  const listPrice = req.body.listPrice;
  const salePrice = req.body.salePrice;
  const currency = req.body.currency;
  const order = req.body.order;
  const freeCargo = req.body.freeCargo;
  const cargoFee = req.body.cargoFee;
  const mainPage = req.body.mainPage;




  try {
    const price = await (await ProductCountryPrice.findById(priceId));
    if (!price) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    price.country = country;
    price.salePrice = salePrice;
    price.listPrice = listPrice;
    price.currency = currency;
    price.order = order;
    price.freeCargo = freeCargo;
    price.cargoFee = cargoFee;
    price.mainPage = mainPage;


    if (listPrice !== salePrice) {
      if (salePrice < listPrice) {

        price.discount = Number(Number((listPrice - salePrice) / listPrice).toFixed(2)) * 100;


        price.discount = Number(price.discount.split(".")[0]);


      }
    }

    const result = await price.save();

    res.status(200).json({ message: 'Price updated!', price: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

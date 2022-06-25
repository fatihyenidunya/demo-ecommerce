const mongodb = require('mongodb');
const OrderTransaction = require('../models/orderTransaction');
const ShipmentDetail = require('../models/shipmentDetail');
const ShippedProduct = require('../models/shippedProduct');
const OrderProductTransaction = require('../models/orderProductTransaction');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Transporter = require('../models/transporter');

const Custom = require('../models/custom');
const Product = require('../models/product');
const OrderProduct = require('../models/orderProduct');
const { validationResult } = require('express-validator/check');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Excel = require('exceljs');

const fileHelper = require('../utils/file');
const { ADDRGETNETWORKPARAMS } = require('dns');
const orderproduct = require('../models/orderProduct');
const shipmentDetail = require('../models/shipmentDetail');
const order = require('../models/order');
const { query } = require('express');
const PromotionProduct = require('../models/promotionProduct');
const product = require('../models/product');
const errorService = require('../classes/errorService');


const ObjectId = mongodb.ObjectId;

exports.getOrder = async (req, res, next) => {




    const orderId = ObjectId(req.params.id);


    try {

        const order = await Order
            .find({ '_id': orderId })
            .populate({ path: 'customerId', select: 'country company address taxId fax phone email' })
            .exec();



        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            order: order[0]



        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('shipmentController', 'getOrder', 32, 500, err);

        next(err);
    }

}





exports.getShipmentDetails = async (req, res, next) => {




    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const customer = req.query.customer || '';
    const status = req.query.status || 'Pending Approval';
    const startMonth = req.query.startmonth || '1';
    const startDay = req.query.startday || '1';
    const startYear = req.query.startyear || '2000';
    const endMonth = req.query.endmonth || '12';
    const endDay = req.query.endday || '30';
    const endYear = req.query.endyear || '2030';
    const userRole = req.query.userrole;
    const userName = req.query.username;

    let totalItems = 40;


    let perPage = Number(pageSize);


    let queryTxt = "";
    let customerTxt = "";
    let statusTxt = "";
    let ownerTxt = "";

    startDate = new Date(startYear + "-" + startMonth + "-" + startDay);
    endDate = new Date(endYear + "-" + endMonth + "-" + endDay);

    if (customer != '') {
        if (customer != 'undefined') {
            customerTxt = '"customer":{ "\$regex" : "' + customer + '", "\$options" : "i"},';
        }
    }

    if (status != 'All') {
        if (status != 'undefined') {
            statusTxt = '"status":"' + status + '",';

        }
    }


    if (userRole != 'Manager') {
        ownerTxt = '"owner":"' + userName + '",';
    }

    queryTxt = '{' + customerTxt + statusTxt + ownerTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';


    let query = JSON.parse(queryTxt);
    // console.log('');
    console.log(query)




    try {
        const items = await ShipmentDetail.find(query).countDocuments();

        const shipmentDetails = await ShipmentDetail
            .find(query, { _id: 1, country: 1, customer: 1, orderDate: 1, createdAt: 1, grandTotal: 1, currency: 1, owner: 1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });

   



        res.status(200).json({
            message: 'Fetched customer basket products succesfully',
            shipmentDetails: shipmentDetails,
            totalItems: items

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('shipmentController', 'getShipmentDetails', 72, 500, err);

        next(err);
    }

}




exports.getShipmentDetail = async (req, res, next) => {



    const id = req.params.id;


    try {

        const shipmentDetail = await ShipmentDetail
            .findById(id);



        res.status(200).json({
            message: 'Fetched shipment detail succesfully',
            shipmentDetail: shipmentDetail,

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('shipmentController', 'getShipmentDetail', 165, 500, err);

        next(err);
    }

}

exports.getShipmentDetailByOrderId = async (req, res, next) => {



    const orderId = req.params.orderId;



    try {

        const shipmentDetail = await ShipmentDetail
            .find({ 'order': orderId })
            .sort({ createdAt: -1 });





        res.status(200).json({
            message: 'Fetched shipment detail succesfully',
            shipmentDetail: shipmentDetail[0],

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('shipmentController', 'getShipmentDetailByOrderId', 196, 500, err);

        next(err);
    }

}

exports.postShipmentDetail = async (req, res, next) => {

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }

    try {






        const orderId = ObjectId(req.body.orderId);
        const orderDate = req.body.orderDate;
        const customerId = ObjectId(req.body.customerId);
        const customerCompany = req.body.customerCompany;
        const customerCountry = req.body.customerCountry;
        const customerState = req.body.customerState;
        const customerCity = req.body.customerCity;
        const customerZipCode = req.body.customerZipCode;
        const customerAddress = req.body.customerAddress;
        const customerPhone = req.body.customerPhone;
        const customerEmail = req.body.customerEmail;
        const customerFax = convertToEmptyFromUndefined(req.body.customerFax);
        const customerTaxId = convertToEmptyFromUndefined(req.body.customerTaxId);
        const deliveryTerms = convertToEmptyFromUndefined(req.body.deliveryTerms);
        const payments = req.body.payments;
        const creditNumber = convertToEmptyFromUndefined(req.body.creditNumber);
        const customOffice = convertToEmptyFromUndefined(req.body.customOffice);
        const manifestPlace = convertToEmptyFromUndefined(req.body.manifestPlace);
        const sealNo = convertToEmptyFromUndefined(req.body.sealNo);
        const imoCode = convertToEmptyFromUndefined(req.body.imoCode);
        const shipNameVoyage = convertToEmptyFromUndefined(req.body.shipNameVoyage);
        const shipFlag = convertToEmptyFromUndefined(req.body.shipFlag);
        const entrancePort = convertToEmptyFromUndefined(req.body.entrancePort);
        const evacuationPort = convertToEmptyFromUndefined(req.body.evacuationPort);
        const vgmCutOff = convertToEmptyFromUndefined(req.body.vgmCutOff);
        const manifestCutOff = convertToEmptyFromUndefined(req.body.manifestCutOff);
        const agency = convertToEmptyFromUndefined(req.body.agency);
        const truckPlate = convertToEmptyFromUndefined(req.body.truckPlate);
        const driver = convertToEmptyFromUndefined(req.body.driver);
        const goodImcoDetail = convertToEmptyFromUndefined(req.body.goodImcoDetail);
        const gTypeCode = convertToEmptyFromUndefined(req.body.gTypeCode);
        const description = convertToEmptyFromUndefined(req.body.description);
        const customCompany = req.body.customCompany;
        const customOfficer = req.body.customOfficer;
        const customPhone = req.body.customPhone;
        const customMobil = req.body.customMobil;
        const customEmail = req.body.customEmail;
        const transporterCompany = req.body.transporterCompany;
        const transporterOfficer = req.body.transporterOfficer;
        const transporterPhone = req.body.transporterPhone;
        const transporterMobil = req.body.transporterMobil;
        const transporterEmail = req.body.transporterEmail;
        const phone = convertToEmptyFromUndefined(req.body.phone);
        const note = convertToEmptyFromUndefined(req.body.note);
        const kap = convertToEmptyFromUndefined(req.body.kap);
        const grandTotal = req.body.grandTotal;

        const producer1 = convertToEmptyFromUndefined(req.body.producer1);
        const producer2 = convertToEmptyFromUndefined(req.body.producer2);
        const producer3 = convertToEmptyFromUndefined(req.body.producer3);
        const producer4 = convertToEmptyFromUndefined(req.body.producer4);
        const notify = convertToEmptyFromUndefined(req.body.notify);
        const hsCode = convertToEmptyFromUndefined(req.body.hsCode);
        const currency = convertToEmptyFromUndefined(req.body.currency);
        const foreignCurrencyPrice = req.body.foreignCurrencyPrice;
        const currencyToLocal = req.body.currencyToLocal;
        const foreignPriceDescription = convertToEmptyFromUndefined(req.body.foreignPriceDescription);
        const localPriceDescription = convertToEmptyFromUndefined(req.body.localPriceDescription);
        const invoiceNumber = req.body.invoiceNumber;
        const madeBy = convertToEmptyFromUndefined(req.body.madeBy);
        const bank = req.body.bank;
        const brunch = req.body.brunch;
        const accountNo = req.body.accountNo;
        const orderProducts = req.body.orderProducts;
        const ibanNo = req.body.ibanNo;
        const swiftCode = req.body.swiftCode;
        const paymentCurrency = req.body.paymentCurrency;
        const userName = req.body.userName;
        const userRole = req.body.userRole;



        // console.log("orderId : " + orderId)
        // console.log("deliveryTerms : " + deliveryTerms)
        // console.log("customOffice : " + customOffice)
        // console.log("manifestPlace : " + manifestPlace)
        // console.log("sealNo : " + sealNo)
        // console.log("imoCode : " + imoCode)
        // console.log("shipNameVoyage : " + shipNameVoyage)
        // console.log("shipNameVoyage" + shipFlag)
        // console.log("entrancePort" + entrancePort)
        // console.log("evacuationPort : " + evacuationPort)
        // console.log("vgmCutOff : " + vgmCutOff)
        // console.log("manifestCutOff : " + manifestCutOff)
        // console.log("truckPlate : " + truckPlate)
        // console.log("driver : " + driver)
        // console.log("goodImcoDetail : " + goodImcoDetail)
        // console.log("gTypeCode : " + gTypeCode)
        // console.log("description : " + description)
        // console.log("customCompany :" + customCompany)
        // console.log("customOfficer : " + customOfficer)
        // console.log("customPhone :" + customPhone)
        // console.log("customMobil :" + customMobil)
        // console.log("customEmail :" + customEmail)
        // console.log("transporterCompany :" + transporterCompany)
        // console.log("transporterOfficer :" + transporterOfficer)
        // console.log("transporterPhone :" + transporterPhone)
        // console.log("transporterMobil :" + transporterMobil)
        // console.log("transporterEmail : " + transporterEmail)
        // console.log("madeBy : " + madeBy)
        // console.log("note : " + note)
        // console.log("grandTotal : " + grandTotal)

        // console.log("producer1 : " + producer1)
        // console.log("producer2 : " + producer2)
        // console.log("producer3 : " + producer3)
        // console.log("producer4 : " + producer4)
        // console.log("notify : " + notify)
        // console.log("hsCode : " + hsCode)
        // console.log("currency : " + currency)
        // console.log("foreignCurrencyPrice : " + foreignCurrencyPrice)
        // console.log("currencyToLocal : " + currencyToLocal)
        // console.log("foreignPriceDescription :" + foreignPriceDescription)
        // console.log("localPriceDescription :" + localPriceDescription)

        // console.log("invoiceNumber : " + invoiceNumber)
        // console.log("bank :" + bank)
        // console.log("madeBy :" + madeBy)
        // console.log("brunch :" + brunch)
        // console.log("accountNo :" + accountNo)





        const products = JSON.parse(orderProducts);



        let productTotalPrices = 0;



        const newShipmentDetail = new ShipmentDetail({
            order: orderId,
            country: customerCountry,
            customer: customerCompany,
            customerId: customerId,
            address: customerAddress,
            phone: customerPhone,
            email: customerEmail,
            fax: customerFax,
            taxId: customerTaxId,
            orderDate: orderDate,
            deliveryTerms: deliveryTerms,
            agency: agency,
            grandTotal: grandTotal,
            kap: kap,
            payments: payments,
            creditNumber: creditNumber,

            customOffice: customOffice,
            manifestPlace: manifestPlace,
            sealNo: sealNo,
            imoCode: imoCode,
            shipNameVoyage: shipNameVoyage,
            shipFlag: shipFlag,
            entrancePort: entrancePort,
            evacuationPort: evacuationPort,
            vgmCutOff: vgmCutOff,
            manifestCutOff: manifestCutOff,
            truckPlate: truckPlate,
            driver: driver,
            goodImcoDetail: goodImcoDetail,
            gTypeCode: gTypeCode,
            description: description,
            customCompany: customCompany,
            customOfficer: customOfficer,
            customPhone: customPhone,
            customMobil: customMobil,
            customEmail: customEmail,
            transporterCompany: transporterCompany,
            transporterOfficer: transporterOfficer,
            transporterPhone: transporterPhone,
            transporterMobil: transporterMobil,
            transporterEmail: transporterEmail,
            phone: phone,
            note: note,
            producer1: producer1,
            producer2: producer2,
            producer3: producer3,
            producer4: producer4,
            notify: notify,
            hsCode: hsCode,
            currency: currency,
            foreignCurrencyPrice: foreignCurrencyPrice,
            currencyToLocal: currencyToLocal,
            foreignPriceDescription: foreignPriceDescription,
            localPriceDescription: localPriceDescription,
            invoiceNumber: invoiceNumber,
            madeBy: madeBy,
            bank: bank,
            brunch: brunch,
            accountNo: accountNo,
            ibanNo: ibanNo,
            swiftCode: swiftCode,
            paymentCurrency: paymentCurrency,
            owner: userName

        });

        const customer = new Customer({

            company: customerCompany,
            country: customerCountry,
            address: customerAddress,
            phone: customerPhone,
            email: customerEmail,
            fax: customerFax,
            taxId: customerTaxId,
            locations: [{

                state: customerState,
                city: customerCity,
                zipCode: customerZipCode
            }]



        });

        newShipmentDetail.products = products;




        // products.forEach(p => {

        //     const newShippedProduct = new ({
        //         customer: customerId,
        //         order: orderId,
        //         product: p.product._id,
        //         title: p.title,
        //         turkishTitle=p.turkishTitle,
        //         imageUrl=p.imageUrl,
        //         volume=p.volume,
        //         volumeEntity=p.volumeEntity,
        //         quantityInBox=p.quantityInBox,
        //         grossWeight=p.grossWeight,
        //         grossWeightEntity=p.grossWeightEntity,
        //         boxWidth=p.boxWidth,
        //         boxLength=p.boxLength,
        //         boxHeight=p.boxHeight,
        //         boxEntity=p.boxEntity,
        //         unit: p.unit,
        //         unitPrice: p.unitPrice,
        //         currency: p.currency,
        //         box: p.box,
        //         totalPrice: p.totalPrice,
        //         promotion: p.promotion,
        //         grossWeight: p.grossWeight,
        //         emptyBoxWeight: p.emptyBoxWeight
        //     });
        //     productTotalPrices += p.totalPrice;
        //     //  const shippedResult = newShippedProduct.save();

        //     newShipmentDetail.products.push(newShippedProduct);

        // });

        const result = await newShipmentDetail.save();



        const xcelFile = await MakeXcel(customerId, customer, newShipmentDetail);



        res.status(201).json({
            statusCode: 201, message: 'Products has been shipped!', xcel: xcelFile,

        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('shipmentController', 'postShipmentDetail', 231, 500, err);

        next(err);
    }
};

convertToEmptyFromUndefined = (value) => {
    if (value === undefined || value === 'undefined') {
        value = '';
    }
    return value;

}


MakeXcel = async (customerId, customer, shipmentDetail) => {



    let paymentTerm;
    let paymentBased;


    fileName = 'order-' + shipmentDetail.order + '.xlsx';


    newXcelFilename = fileName;
    const newXcelFile = path.join('data', 'xcel', newXcelFilename);


    // fs.unlinkSync(newXcelFile);


    const promotionProducts = await PromotionProduct.find({ 'orderId': shipmentDetail.order });
    const order = await Order.findById(shipmentDetail.order);

    paymentBased = order.paymentBased;
    paymentTerm = order.paymentTerm;

    const xcelTemplate = path.join('data', 'AsilGroupTemplate.xlsx');

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(xcelTemplate);

    // workbook.eachSheet(function (worksheet, sheetId) {

    //     console.log(worksheet.name);
    // });

    let wsCommercial1 = workbook.getWorksheet('Commercial1');
    let wsPackingGeneral = workbook.getWorksheet('Packing General');
    let wsTRFatura = workbook.getWorksheet('TR Fatura');
    let wsIrsaliye = workbook.getWorksheet('İrsaliye');
    let wsTalimat = workbook.getWorksheet('Talimat');

    makeCommercial1Report(customerId, customer, wsCommercial1, shipmentDetail, promotionProducts, paymentBased, paymentTerm);

    makePackingGeneralReport(customerId, customer, wsPackingGeneral, shipmentDetail, promotionProducts, paymentBased);

    makeTRFaturaReport(customerId, customer, wsTRFatura, shipmentDetail, promotionProducts, paymentBased, paymentTerm);

    makeIrsaliyeReport(customerId, customer, wsIrsaliye, shipmentDetail, promotionProducts, paymentBased, paymentTerm);

    makeTalimatReport(customerId, customer, wsTalimat, shipmentDetail, paymentBased, paymentTerm);

    try {


        let _now = new Date();
        // let _date = _now.getMonth() + "-" + _now.getDay() + "-" + _now.getFullYear() + '_' + _now.getHours() + '-' + _now.getMinutes() + '-' + _now.getSeconds();

        // fileName = customer.company.replace(/ /g, '') + '_' + customer.country + '_' + _date;


        fileName = 'order-' + shipmentDetail.order + '.xlsx';


        newXcelFilename = fileName;
        const newXcelFile = path.join('data', 'xcel', newXcelFilename);


        await workbook.xlsx.writeFile(newXcelFile);



        return newXcelFile;



    } catch (err) {

        errorService.sendErrorNotificationViaEmail('shipmentController', 'MakeXcel', 540, 500, err);


    }

}


makeCommercial1Report = async (customerId, customer, wsCommercial1, shipmentDetail, promotionProducts, paymentBased, paymentTerm) => {

    console.log('*****customer adress start**********');
    console.log(customer);

    console.log('*****customer adress end**********');

    wsCommercial1.getCell(13, 3).value = "Company : " + customer.company;
    wsCommercial1.getCell(14, 3).value = "Address : " + customer.address;
    wsCommercial1.getCell(15, 3).value = "Country : " + customer.country;
    wsCommercial1.getCell(16, 3).value = "Phone : " + customer.phone;
    // wsCommercial1.getCell(17, 3).value = "Fax : " + customer.fax;
    wsCommercial1.getCell(17, 3).value = "Tax Id : " + customer.taxId;




    wsCommercial1.getCell(22, 3).value = "Bank Details : " + shipmentDetail.bank + "       Branch : " + shipmentDetail.brunch + "    Account No :" + shipmentDetail.accountNo;
    wsCommercial1.getCell(23, 3).value = shipmentDetail.paymentCurrency + " IBAN CODE :" + shipmentDetail.ibanNo;
    wsCommercial1.getCell(24, 3).value = "Swift CODE :" + shipmentDetail.swiftCode;



    let _now = new Date();

    wsCommercial1.getCell(12, 11).value = shipmentDetail.invoiceNumber;
    wsCommercial1.getCell(14, 11).value = (_now.getMonth() + 1) + " / " + _now.getDate() + " / " + _now.getFullYear();
    wsCommercial1.getCell(15, 11).value = paymentBased;
    wsCommercial1.getCell(16, 11).value = paymentTerm;
    wsCommercial1.getCell(18, 11).value = shipmentDetail.creditNumber;


    orginRow = 26;
    let row = orginRow;

    totalBoxes = 0;
    totalPieces = 0;
    grandTotal = 0;
    totalNetWeight = 0;
    totalGrossWeight = 0;
    totalM3 = 0;

    promotionHeader = false;




    shipmentDetail.products.forEach(p => {



        totalBoxes += Number(p.readyBox);
        totalPieces += Number(p.readyUnit);
        grandTotal += Number(p.totalPrice);
        totalNetWeight += Number(p.product.grossWeight * p.readyBox);
        totalGrossWeight += Number(p.product.grossWeight * p.readyBox) + (Number(p.product.emptyBoxWeight) * p.readyBox);
        // totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight)) / 1000000000;
        totalM3 += ((Number(p.product.boxHeight) * Number(p.product.boxWidth) * Number(p.product.boxLength)) * p.readyBox) / 1000000000;

        var rowValues = [];
        rowValues[3] = p.product.title;

        let vEntity = p.product.volumeEntity;

        if (p.product.volumeEntity === 'Not') {

            vEntity = '';

        }

        rowValues[6] = p.product.volume + " " + vEntity;
        rowValues[7] = p.product.quantityInBox;

        rowValues[9] = p.readyBox;
        rowValues[10] = p.readyUnit;
        rowValues[11] = p.unitPrice + " " + p.currency;
        rowValues[12] = p.totalPrice + " " + p.currency;



        wsCommercial1.insertRow(row, rowValues);



        wsCommercial1.getCell(row, 2).border = { left: { style: 'medium' }, top: { style: 'thin' } };
        wsCommercial1.getCell(row, 3).alignment = { vertical: 'middle' };
        wsCommercial1.getCell(row, 3).border = { left: { style: 'medium' }, top: { style: 'thin' } };
        wsCommercial1.getCell(row, 6).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 6).border = { top: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' } };
        wsCommercial1.getCell(row, 7).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 7).border = { top: { style: 'thin' }, right: { style: 'thin' } };
        wsCommercial1.getCell(row, 9).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 9).border = { top: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' } };
        wsCommercial1.getCell(row, 10).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 10).border = { top: { style: 'thin' }, right: { style: 'thin' } };
        wsCommercial1.getCell(row, 11).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 11).border = { top: { style: 'thin' }, right: { style: 'medium' } };
        wsCommercial1.getCell(row, 12).alignment = { horizontal: 'center', vertical: 'middle' };
        wsCommercial1.getCell(row, 12).border = { top: { style: 'medium' }, right: { style: 'medium' } };



        row++;

    });

    if (promotionProducts.length !== 0) {

        if (promotionHeader === false) {
            wsCommercial1.insertRow(row, []);

            // wsCommercial1.unMergeCells('A' + row);


            //      wsCommercial1.mergeCells('C' + row + ':' + 'L' + row);


            wsCommercial1.getCell(row, 3).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E5E5E5' }
            };

            wsCommercial1.getCell(row, 4).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E5E5E5' }
            };
            wsCommercial1.getCell(row, 5).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E5E5E5' }
            };

            wsCommercial1.getCell(row, 6).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E5E5E5' }
            };
            wsCommercial1.getCell(row, 7).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E5E5E5' }
            };
            wsCommercial1.getCell(row, 9).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E5E5E5' }
            };
            wsCommercial1.getCell(row, 10).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E5E5E5' }
            };
            wsCommercial1.getCell(row, 11).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E5E5E5' }
            };
            wsCommercial1.getCell(row, 12).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E5E5E5' }
            };

            wsCommercial1.getCell(row, 2).border = { left: { style: 'medium' }, top: { style: 'thin' } };
            wsCommercial1.getCell(row, 3).value = 'FREE OF CHARGE ONLY FOR CUSTOM PURPOSES';
            wsCommercial1.getCell(row, 3).alignment = { horizontal: 'center', vertical: 'middle' };
            wsCommercial1.getCell(row, 3).font = { 'bold': true, 'size': 12 };
            wsCommercial1.getCell(row, 3).border = { left: { style: 'medium' }, top: { style: 'thin' } };
            wsCommercial1.getCell(row, 4).border = { top: { style: 'thin' } };
            wsCommercial1.getCell(row, 5).border = { top: { style: 'thin' } };


            wsCommercial1.getCell(row, 6).border = { top: { style: 'thin' } };
            wsCommercial1.getCell(row, 7).border = { right: { style: 'thin' }, top: { style: 'thin' } };
            wsCommercial1.getCell(row, 8).border = { right: { style: 'thin' } };
            wsCommercial1.getCell(row, 9).border = { top: { style: 'thin' } };
            wsCommercial1.getCell(row, 10).border = { top: { style: 'thin' } };
            wsCommercial1.getCell(row, 11).border = { top: { style: 'thin' } };

            wsCommercial1.getCell(row, 12).border = { right: { style: 'medium' }, top: { style: 'thin' } };


            row++;
            promotionHeader = true;

        }



        for (let p of promotionProducts) {



            totalBoxes += Number(p.box);
            totalPieces += Number(p.unit);
            grandTotal += Number(p.totalPrice);
            totalNetWeight += Number(p.grossWeight * p.box);
            totalGrossWeight += Number(p.grossWeight * p.box) + (Number(p.emptyBoxWeight) * p.box);
            // totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight)) / 1000000000;
            totalM3 += ((Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxLength)) * p.box) / 1000000000;

            var rowValues = [];
            rowValues[3] = p.title;

            let vEntity = p.volumeEntity;

            if (p.volumeEntity === 'Not') {

                vEntity = '';

            }

            rowValues[6] = p.volume + " " + vEntity;
            rowValues[7] = p.quantityInBox;

            rowValues[9] = p.box;
            rowValues[10] = p.unit;
            rowValues[11] = p.unitPrice + " " + p.currency;
            rowValues[12] = p.totalPrice + " " + p.currency;



            wsCommercial1.insertRow(row, rowValues);



            wsCommercial1.getCell(row, 2).border = { left: { style: 'medium' }, top: { style: 'thin' } };
            wsCommercial1.getCell(row, 3).alignment = { vertical: 'middle' };
            wsCommercial1.getCell(row, 3).border = { left: { style: 'medium' }, top: { style: 'thin' } };
            wsCommercial1.getCell(row, 6).alignment = { horizontal: 'center', vertical: 'middle' };
            wsCommercial1.getCell(row, 6).border = { top: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' } };
            wsCommercial1.getCell(row, 7).alignment = { horizontal: 'center', vertical: 'middle' };
            wsCommercial1.getCell(row, 7).border = { top: { style: 'thin' }, right: { style: 'thin' } };
            wsCommercial1.getCell(row, 9).alignment = { horizontal: 'center', vertical: 'middle' };
            wsCommercial1.getCell(row, 9).border = { top: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' } };
            wsCommercial1.getCell(row, 10).alignment = { horizontal: 'center', vertical: 'middle' };
            wsCommercial1.getCell(row, 10).border = { top: { style: 'thin' }, right: { style: 'thin' } };
            wsCommercial1.getCell(row, 11).alignment = { horizontal: 'center', vertical: 'middle' };
            wsCommercial1.getCell(row, 11).border = { top: { style: 'thin' }, right: { style: 'medium' } };
            wsCommercial1.getCell(row, 12).alignment = { horizontal: 'center', vertical: 'middle' };
            wsCommercial1.getCell(row, 12).border = { top: { style: 'medium' }, right: { style: 'medium' } };



            row++;

        }


    }




    wsCommercial1.spliceRows(row, 1);

    wsCommercial1.getCell(row, 8).value = shipmentDetail.kap + ' kap';;
    wsCommercial1.getCell(row, 9).value = totalBoxes;
    wsCommercial1.getCell(row, 10).value = totalPieces;
    wsCommercial1.getCell(row, 12).value = grandTotal + ' ' + shipmentDetail.currency;
    wsCommercial1.getCell(row + 3, 12).value = grandTotal + ' ' + shipmentDetail.currency;
    wsCommercial1.getCell(row, 12).font = { 'bold': true };

    let row1 = Number(row) + Number(1);
    let row2 = Number(row) + Number(2);
    let row3 = Number(row) + Number(3);
    let row4 = Number(row) + Number(4);
    let row5 = Number(row) + Number(5);
    let row6 = Number(row) + Number(6);

    let row10 = Number(row) + Number(10);
    let row11 = Number(row) + Number(11);
    let row12 = Number(row) + Number(12);
    let row13 = Number(row) + Number(13);
    let row14 = Number(row) + Number(14);




    // wsCommercial1.unMergeCells('C' + 27);
    // wsCommercial1.unMergeCells('G' + 37);
    wsCommercial1._merges = {};


    wsCommercial1.mergeCells('C' + row + ':' + 'G' + row);
    wsCommercial1.getCell(row, 3).border = { right: { style: 'medium' }, top: { style: 'thin' }, left: { style: 'medium' } };

    wsCommercial1.getCell(row, 9).border = { right: { style: 'thin', color: { argb: 'FFFFFF' } }, top: { style: 'thin' }, left: { style: 'medium' } };



    wsCommercial1.mergeCells('H' + row1 + ':' + 'K' + row1);
    wsCommercial1.getCell(row1, 11).border = { right: { style: 'medium' }, top: { style: 'medium' }, left: { style: 'medium' } };


    wsCommercial1.mergeCells('H' + row2 + ':' + 'K' + row2);
    wsCommercial1.getCell(row2, 11).border = { right: { style: 'medium' }, top: { style: 'medium' } };


    wsCommercial1.mergeCells('H' + row3 + ':' + 'K' + row3);
    wsCommercial1.getCell(row3, 11).border = { right: { style: 'medium' }, top: { style: 'medium' } };



    wsCommercial1.mergeCells('H' + row4 + ':' + 'K' + row4);
    wsCommercial1.getCell(row4, 11).border = { right: { style: 'medium' }, top: { style: 'medium' } };

    wsCommercial1.unMergeCells('H' + row5);
    wsCommercial1.mergeCells('H' + row5 + ':' + 'K' + row5);
    wsCommercial1.getCell(row5, 11).border = { right: { style: 'medium' }, top: { style: 'medium' } };





    wsCommercial1.mergeCells('H' + row6 + ':' + 'K' + row6);
    wsCommercial1.getCell(row6, 11).border = { right: { style: 'medium' }, top: { style: 'medium' }, bottom: { style: 'medium' } };

    wsCommercial1.unMergeCells('G' + row10);
    wsCommercial1.mergeCells('G' + row10 + ':' + 'I' + row10);
    wsCommercial1.getCell(row10, 7).border = { right: { style: 'medium' }, top: { style: 'medium' } };

    wsCommercial1.unMergeCells('G' + row11);
    wsCommercial1.mergeCells('G' + row11 + ':' + 'I' + row11);
    wsCommercial1.getCell(row11, 7).border = { right: { style: 'medium' }, top: { style: 'thin' } };

    wsCommercial1.unMergeCells('G' + row12);
    wsCommercial1.mergeCells('G' + row12 + ':' + 'I' + row12);
    wsCommercial1.getCell(row12, 7).border = { right: { style: 'medium' }, top: { style: 'thin' } };

    wsCommercial1.unMergeCells('G' + row13);
    wsCommercial1.mergeCells('G' + row13 + ':' + 'I' + row13);
    wsCommercial1.getCell(row13, 7).border = { right: { style: 'medium' }, top: { style: 'thin' } };

    wsCommercial1.unMergeCells('G' + row14);
    wsCommercial1.mergeCells('G' + row14 + ':' + 'I' + row14);
    wsCommercial1.getCell(row14, 7).border = { right: { style: 'medium' }, bottom: { style: 'medium' }, top: { style: 'thin' } };



    wsCommercial1.getCell('G' + row10).value = totalGrossWeight.toFixed(2);
    wsCommercial1.getCell('G' + row11).value = totalNetWeight.toFixed(2);
    wsCommercial1.getCell('G' + row12).value = totalBoxes;
    wsCommercial1.getCell('G' + row13).value = shipmentDetail.kap + ' kap';
    wsCommercial1.getCell('G' + row14).value = totalM3.toFixed(2);

    // wsCommercial1.getCell(row,2).border={left: {style:'medium'},top:{ style:'thin'} };
    // wsCommercial1.getCell(row,3).border={left: {style:'none'},top:{ style:'thin'} };
    // wsCommercial1.getCell(row,6).border={top: {style:'thin'},right: {style:'thin'},left: {style:'thin'} };
    // wsCommercial1.getCell(row,7).border={top: {style:'thin'},right: {style:'thin'} };
    // wsCommercial1.getCell(row,9).border={top: {style:'thin'},right: {style:'thin'},left: {style:'thin'} };
    // wsCommercial1.getCell(row,10).border={top: {style:'thin'},right: {style:'thin'} };
    // wsCommercial1.getCell(row,11).border={top: {style:'thin'},right: {style:'medium'} };
    // wsCommercial1.getCell(row,12).border={top: {style:'medium'},right: {style:'medium'} };


}

makePackingGeneralReport = async (customerId, customer, workSheet, shipmentDetail, promotionProducts, paymentBased) => {

    workSheet.getCell(17, 2).value = "Company : " + customer.company;
    workSheet.getCell(18, 2).value = "Address : " + customer.address;
    workSheet.getCell(19, 2).value = "Country : " + customer.country;
    workSheet.getCell(20, 2).value = "Phone : " + customer.phone;
    // workSheet.getCell(21, 2).value = "Fax : " + customer.fax;
    workSheet.getCell(21, 2).value = "Tax Id : " + customer.taxId;

    workSheet.getCell(25, 2).value = "Bank Details : " + shipmentDetail.bank + "       Branch : " + shipmentDetail.brunch + "    Account No :" + shipmentDetail.accountNo;
    workSheet.getCell(26, 2).value = shipmentDetail.paymentCurrency + " IBAN CODE :" + shipmentDetail.ibanNo;
    workSheet.getCell(27, 2).value = "Swift CODE :" + shipmentDetail.swiftCode;

    workSheet.getCell(28, 2).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, left: { style: 'medium' }, right: { style: 'thin' } };
    workSheet.getCell(28, 3).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 4).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 5).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 6).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 7).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 8).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 9).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 10).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 11).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 12).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 13).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 14).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 15).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 16).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'thin' } };
    workSheet.getCell(28, 17).border = { bottom: { style: 'thin' }, top: { style: 'thin' }, right: { style: 'medium' } };

    let _now = new Date();

    workSheet.getCell(17, 16).value = shipmentDetail.invoiceNumber;
    workSheet.getCell(16, 16).value = (_now.getMonth() + 1) + " / " + _now.getDate() + " / " + _now.getFullYear();



    orginRow = 29;
    let row = orginRow;


    totalBoxes = 0;
    totalPieces = 0;
    grandTotal = 0;
    totalNetWeight = 0;
    totalGrossWeight = 0;
    totalM3 = 0;

    promotionHeader = false;

    shipmentDetail.products.forEach(p => {


        totalBoxes += Number(p.readyBox);
        totalPieces += Number(p.readyUnit);
        grandTotal += Number(p.totalPrice);
        totalNetWeight += Number(p.product.grossWeight * p.readyBox);
        totalGrossWeight += Number(p.product.grossWeight * p.readyBox) + (Number(p.product.emptyBoxWeight) * p.readyBox);
        // totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight)) / 1000000000;
        totalM3 += ((Number(p.product.boxHeight) * Number(p.product.boxWidth) * Number(p.product.boxLength)) * p.readyBox) / 1000000000;



        var rowValues = [];
        rowValues[2] = p.product.title;
        let vEntity = p.product.volumeEntity;

        if (p.product.volumeEntity === 'Not') {

            vEntity = '';

        }

        rowValues[5] = p.product.volume + " " + vEntity;
        rowValues[6] = p.product.boxWidth;
        rowValues[7] = p.product.boxLength;
        rowValues[8] = p.product.boxHeight;

        rowValues[9] = p.product.quantityInBox;
        //rowValues[10] = p.unit;

        rowValues[11] = p.readyBox;
        rowValues[12] = p.readyUnit;

        rowValues[14] = Number(p.product.grossWeight * p.readyBox) + Number((p.product.emptyBoxWeight) * p.readyBox);
        rowValues[15] = p.product.emptyBoxWeight;
        rowValues[16] = Number(p.product.grossWeight * p.readyBox)
        m3 = ((Number(p.product.boxHeight) * Number(p.product.boxWidth) * Number(p.product.boxLength)) * p.readyBox) / 1000000000;
        rowValues[17] = m3.toFixed(2);


        workSheet.getRow(row).height = 20;
        workSheet.insertRow(row, rowValues);
        workSheet.getCell(row, 2).border = { left: { style: 'medium' }, };
        workSheet.getCell(row, 2).alignment = { vertical: 'middle' };
        workSheet.getCell(row, 3).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 3).alignment = { vertical: 'middle' };
        workSheet.getCell(row, 4).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 4).alignment = { vertical: 'middle' };
        workSheet.getCell(row, 5).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 5).alignment = { vertical: 'middle', horizontal: 'center' };
        workSheet.getCell(row, 6).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 6).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 7).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 7).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 8).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 8).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 9).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 9).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 10).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 10).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 11).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 11).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 12).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 12).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 13).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 13).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 14).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 14).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 15).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 15).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 16).border = { left: { style: 'thin' } };
        workSheet.getCell(row, 16).alignment = { vertical: 'middle', horizontal: 'center' };

        workSheet.getCell(row, 17).border = { left: { style: 'thin' }, right: { style: 'medium' } };
        workSheet.getCell(row, 17).alignment = { vertical: 'middle', horizontal: 'center' };
        row++;

    });



    if (promotionProducts.length !== 0) {

        if (promotionHeader === false) {
            workSheet.insertRow(row, []);

            workSheet.getRow(row).height = 20;

            workSheet.getCell(row, 2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
            workSheet.getCell(row, 3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
            workSheet.getCell(row, 4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
            workSheet.getCell(row, 5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
            workSheet.getCell(row, 9).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
            workSheet.getCell(row, 11).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
            workSheet.getCell(row, 12).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
            workSheet.getCell(row, 13).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
            workSheet.getCell(row, 14).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
            workSheet.getCell(row, 15).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };
            workSheet.getCell(row, 16).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } };


            workSheet.getCell(row, 2).value = 'FREE OF CHARGE ONLY FOR CUSTOM PURPOSES';
            workSheet.getCell(row, 2).alignment = { horizontal: 'center', vertical: 'middle' };
            workSheet.getCell(row, 2).font = { 'bold': true, 'size': 12 };
            workSheet.getCell(row, 2).border = { left: { style: 'medium' }, top: { style: 'thin' }, bottom: { style: 'thin' } };
            workSheet.getCell(row, 4).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
            workSheet.getCell(row, 5).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };




            workSheet.getCell(row, 9).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };

            workSheet.getCell(row, 11).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };

            workSheet.getCell(row, 12).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
            workSheet.getCell(row, 13).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
            workSheet.getCell(row, 14).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
            workSheet.getCell(row, 15).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
            workSheet.getCell(row, 16).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
            workSheet.getCell(row, 17).border = { right: { style: 'medium' } };
            row++;
            promotionHeader = true;

        }

        for (let p of promotionProducts) {

            totalBoxes += Number(p.box);
            totalPieces += Number(p.unit);
            grandTotal += Number(p.totalPrice);
            totalNetWeight += Number(p.grossWeight * p.box);
            totalGrossWeight += Number(p.grossWeight * p.box) + (Number(p.emptyBoxWeight) * p.box);
            // totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight)) / 1000000000;
            totalM3 += ((Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxLength)) * p.box) / 1000000000;

            var rowValues = [];
            rowValues[2] = p.title;

            let vEntity = p.volumeEntity;

            if (p.volumeEntity === 'Not') {

                vEntity = '';

            }



            rowValues[5] = p.volume + " " + vEntity;
            rowValues[6] = p.boxWidth;
            rowValues[7] = p.boxLength;
            rowValues[8] = p.boxHeight;

            rowValues[9] = p.quantityInBox;
            //rowValues[10] = p.unit;

            rowValues[11] = p.box;
            rowValues[12] = p.unit;


            rowValues[14] = Number(p.grossWeight * p.box) + Number((p.emptyBoxWeight) * p.box);
            rowValues[15] = p.emptyBoxWeight;
            rowValues[16] = Number(p.grossWeight * p.box)
            m3 = ((Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxLength)) * p.box) / 1000000000;
            rowValues[17] = m3.toFixed(2);


            workSheet.getRow(row).height = 20;
            workSheet.insertRow(row, rowValues);
            workSheet.getCell(row, 2).border = { left: { style: 'medium' }, };
            workSheet.getCell(row, 2).alignment = { vertical: 'middle' };
            workSheet.getCell(row, 3).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 3).alignment = { vertical: 'middle' };
            workSheet.getCell(row, 4).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 4).alignment = { vertical: 'middle' };
            workSheet.getCell(row, 5).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 5).alignment = { vertical: 'middle', horizontal: 'center' };
            workSheet.getCell(row, 6).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 6).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 7).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 7).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 8).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 8).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 9).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 9).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 10).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 10).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 11).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 11).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 12).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 12).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 13).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 13).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 14).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 14).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 15).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 15).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 16).border = { left: { style: 'thin' } };
            workSheet.getCell(row, 16).alignment = { vertical: 'middle', horizontal: 'center' };

            workSheet.getCell(row, 17).border = { left: { style: 'thin' }, right: { style: 'medium' } };
            workSheet.getCell(row, 17).alignment = { vertical: 'middle', horizontal: 'center' };
            row++;

        }


    }


    workSheet.getCell(18, 17).value = paymentBased;
    workSheet.getCell(19, 17).value = totalGrossWeight.toFixed(2);
    workSheet.getCell(20, 17).value = totalNetWeight.toFixed(2);
    workSheet.getCell(21, 17).value = totalBoxes.toFixed(2);
    workSheet.getCell(22, 17).value = totalM3.toFixed(2);

    workSheet.spliceRows(row, 1);
    workSheet.spliceRows(row, 1);




    workSheet.getCell(row, 2).border = { left: { style: 'medium' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 2).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 3).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 3).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 4).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 4).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 5).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 5).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 6).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 6).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 7).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 7).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 8).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 8).alignment = { vertical: 'middle' };
    workSheet.getCell(row, 9).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 9).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 10).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 10).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 11).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 11).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 12).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 12).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 13).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 13).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 14).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 14).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 15).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 15).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 16).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' } };
    workSheet.getCell(row, 16).alignment = { vertical: 'middle', horizontal: 'center' };
    workSheet.getCell(row, 17).border = { left: { style: 'thin' }, top: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    workSheet.getCell(row, 17).alignment = { vertical: 'middle', horizontal: 'center' };

    workSheet.getCell(row, 17).value = totalM3.toFixed(2);
    workSheet.getCell(row, 17).font = { 'bold': true };
    workSheet.getCell(row, 16).value = totalNetWeight.toFixed(2);
    workSheet.getCell(row, 16).font = { 'bold': true };
    workSheet.getCell(row, 14).value = totalGrossWeight.toFixed(2);
    workSheet.getCell(row, 14).font = { 'bold': true };
    workSheet.getCell(row, 12).value = totalPieces;
    workSheet.getCell(row, 12).font = { 'bold': true };
    workSheet.getCell(row, 11).value = totalBoxes;
    workSheet.getCell(row, 11).font = { 'bold': true };
    workSheet.getCell(row, 10).value = shipmentDetail.kap;
    workSheet.getCell(row, 10).font = { 'bold': true };




}


makeTRFaturaReport = async (customerId, customer, workSheet, shipmentDetail, promotionProducts, paymentBased, paymentTerm) => {

    workSheet.getCell(1, 2).value = "Company : " + customer.company;
    workSheet.getCell(2, 2).value = "Address : " + customer.address;
    workSheet.getCell(3, 2).value = "Country : " + customer.country;
    workSheet.getCell(4, 2).value = "Phone : " + customer.phone;
    // workSheet.getCell(5, 2).value = "Fax : " + customer.fax;
    workSheet.getCell(5, 2).value = "Tax Id : " + customer.taxId;



    let _now = new Date();


    workSheet.getCell(5, 7).value = (_now.getMonth() + 1) + " / " + _now.getDate() + " / " + _now.getFullYear();
    workSheet.getCell(6, 7).value = 'Düzenleme Saati : ' + _now.getHours() + " : " + _now.getMinutes();



    orginRow = 13;
    let row = orginRow;

    totalBoxes = 0;
    totalPieces = 0;
    grandTotal = 0;
    totalNetWeight = 0;
    totalGrossWeight = 0;
    totalM3 = 0;



    workSheet.getRow(row).height = 20;

    shipmentDetail.products.forEach(p => {

        var rowValues = [];
        rowValues[2] = p.product.title;

        let vEntity = p.product.volumeEntity;


        if (p.product.volumeEntity === 'Not') {

            vEntity = '';

        }


        rowValues[3] = p.product.volume + " " + vEntity;
        rowValues[4] = p.unit;
        rowValues[5] = 'ADET';;
        rowValues[6] = p.unitPrice + " " + p.currency;
        rowValues[7] = p.totalPrice + " " + p.currency;

        workSheet.insertRow(row, rowValues);
        row++;


        totalBoxes += Number(p.readyBox);
        totalPieces += Number(p.readyUnit);
        grandTotal += Number(p.totalPrice);
        totalNetWeight += Number(p.product.grossWeight * p.readyBox);
        totalGrossWeight += Number(p.product.grossWeight * p.readyBox) + (Number(p.product.emptyBoxWeight) * p.readyBox);

        totalM3 += ((Number(p.product.boxHeight) * Number(p.product.boxWidth) * Number(p.product.boxLength)) * p.readyBox) / 1000000000;

    });



    if (promotionProducts.length !== 0) {


        for (let p of promotionProducts) {

            var rowValues = [];
            rowValues[2] = p.title + ' Bedelsiz';

            let vEntity = p.volumeEntity;


            if (p.volumeEntity === 'Not') {

                vEntity = '';

            }

            rowValues[3] = p.volume + " " + vEntity;
            rowValues[4] = p.unit;
            rowValues[5] = 'ADET';;
            rowValues[6] = p.unitPrice + " " + p.currency;
            rowValues[7] = p.totalPrice + " " + p.currency;


            workSheet.insertRow(row, rowValues);

            // workSheet.getCell(row, 2).value = p.title + ' Bedelsiz';

            row++;



            totalBoxes += Number(p.box);
            totalPieces += Number(p.unit);
            grandTotal += Number(p.totalPrice);
            totalNetWeight += Number(p.grossWeight * p.box);
            totalGrossWeight += Number(p.grossWeight * p.box) + (Number(p.emptyBoxWeight) * p.box);
            // totalM3 += (Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxHeight)) / 1000000000;
            totalM3 += ((Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxLength)) * p.box) / 1000000000;


        }


    }




    // console.log(shipmentDetail)

    row = row + 2;

    workSheet.getCell(row, 2).value = 'Meşei : ' + shipmentDetail.madeBy;
    row++;
    workSheet.getCell(row, 2).value = 'Teslim Şekli : ' + paymentBased;
    row++;
    workSheet.getCell(row, 2).value = 'Ödeme Şekli : ' + paymentTerm;
    row++;
    workSheet.getCell(row, 2).value = 'Bank : ' + shipmentDetail.bank;
    row++;
    workSheet.getCell(row, 2).value = 'Şube : ' + shipmentDetail.brunch;
    row++;
    workSheet.getCell(row, 2).value = 'Hesap No : ' + shipmentDetail.accountNo;

    row = row + 2;

    workSheet.getCell(row, 2).value = 'Toplam Kap : ' + shipmentDetail.kap + ' kap';
    row++;
    workSheet.getCell(row, 2).value = 'Toplam Metreküp : ' + totalM3.toFixed(2);
    row++;
    workSheet.getCell(row, 2).value = 'Net KGS : ' + totalNetWeight.toFixed(2);
    row++;
    workSheet.getCell(row, 2).value = 'Brüt KGS : ' + totalGrossWeight.toFixed(2);
    // row = row + 2;
    // workSheet.getCell(row, 2).value = shipmentDetail.currency + ' : ' + shipmentDetail.currencyPrice;
    row = row + 2;
    workSheet.getCell(row, 2).value = 'TL Toplam Tutar : ' + shipmentDetail.currencyToLocal;
    row = row + 2;
    workSheet.getCell(row, 2).value = 'YALNIZ : ' + shipmentDetail.localPriceDescription;
    row = row + 2;
    workSheet.getCell(row, 2).value = shipmentDetail.currency + ' ' + grandTotal.toFixed(2);




    // workSheet.spliceRows(row, 1);
    // workSheet.spliceRows(row, 1);








}





function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

makeIrsaliyeReport = async (customerId, customer, workSheet, shipmentDetail, promotionProducts, paymentBased, paymentTerm) => {

    workSheet.getCell(5, 2).value = "Company : " + customer.company;
    workSheet.getCell(6, 2).value = "Address : " + customer.address;
    workSheet.getCell(7, 2).value = "Country : " + customer.country;

    let _now = new Date();

    workSheet.getCell(7, 6).value = (_now.getMonth() + 1) + " / " + _now.getDate() + " / " + _now.getFullYear();

    orginRow = 13;
    let row = orginRow;

    totalBoxes = 0;
    totalPieces = 0;
    grandTotal = 0;
    totalNetWeight = 0;
    totalGrossWeight = 0;
    totalM3 = 0;


    workSheet.getRow(row).height = 20;

    productCategories = [];

    shipmentDetail.products.forEach(p => {



        var rowValues = [];
        rowValues[2] = p.readyUnit;
        rowValues[3] = 'ADET';
        rowValues[5] = p.product.title;

        let vEntity = p.product.volumeEntity;


        if (p.product.volumeEntity === 'Not') {

            vEntity = '';

        }

        rowValues[6] = p.product.volume + " " + vEntity;

        workSheet.insertRow(row, rowValues);



        productCategories.push(p.product.categoryName);
        row++;



        totalBoxes += Number(p.readyBox);
        totalPieces += Number(p.readyUnit);
        grandTotal += Number(p.totalPrice);
        totalNetWeight += Number(p.product.grossWeight * p.readyBox);
        totalGrossWeight += Number(p.product.grossWeight * p.readyBox) + (Number(p.product.emptyBoxWeight) * p.readyBox);

        totalM3 += ((Number(p.product.boxHeight) * Number(p.product.boxWidth) * Number(p.product.boxLength)) * p.readyBox) / 1000000000;

    });


    if (promotionProducts.length !== 0) {

        for (let p of promotionProducts) {


            var rowValues = [];
            rowValues[2] = p.unit;
            rowValues[3] = 'ADET';
            rowValues[5] = p.title + ' Bedelsiz';

            let vEntity = p.volumeEntity;


            if (p.volumeEntity === 'Not') {

                vEntity = '';

            }

            rowValues[6] = p.volume + " " + vEntity;

            workSheet.insertRow(row, rowValues);



            productCategories.push(p.categoryName + ' - Bedelsiz');

            // workSheet.getCell(row, 5).value = p.title + ' Bedelsiz';

            row++;



            totalBoxes += Number(p.box);
            totalPieces += Number(p.unit);
            grandTotal += Number(p.totalPrice);
            totalNetWeight += Number(p.grossWeight * p.box);
            totalGrossWeight += Number(p.grossWeight * p.box) + (Number(p.emptyBoxWeight) * p.box);

            totalM3 += ((Number(p.boxHeight) * Number(p.boxWidth) * Number(p.boxLength)) * p.box) / 1000000000;


        }
    }








    row = row + 2;
    rightRow = row;

    workSheet.getCell(row, 2).value = 'Menşei : ' + shipmentDetail.madeBy;
    row++;
    workSheet.getCell(row, 2).value = 'Teslim Şekli : ' + paymentBased;
    row++;
    workSheet.getCell(row, 2).value = 'Ödeme Şekli : ' + paymentTerm;
    row++;
    workSheet.getCell(row, 2).value = 'Bank : ' + shipmentDetail.bank;
    row++;
    workSheet.getCell(row, 2).value = 'Şube : ' + shipmentDetail.brunch;
    row++;
    workSheet.getCell(row, 2).value = 'Hesap No : ' + shipmentDetail.accountNo;


    workSheet.getCell(rightRow, 5).value = 'Toplam Kap : ' + shipmentDetail.kap + ' kap';
    rightRow++;
    workSheet.getCell(rightRow, 5).value = 'Toplam Metreküp : ' + totalM3.toFixed(2);
    rightRow++;
    workSheet.getCell(rightRow, 5).value = 'Net KGS : ' + totalNetWeight.toFixed(2);
    rightRow++;
    workSheet.getCell(rightRow, 5).value = 'Brüt KGS : ' + totalGrossWeight.toFixed(2);




}

makeTalimatReport = async (customerId, customer, workSheet, shipmentDetail, paymentBased, paymentTerm) => {

    let _now = new Date();
    workSheet.getCell(4, 4).value = _now.getMonth() + " / " + _now.getDay() + " / " + _now.getFullYear();

    workSheet.getCell(15, 2).value = 'Company : ' + customer.company;
    workSheet.getCell(16, 2).value = 'Address : ' + customer.address;
    workSheet.getCell(17, 2).value = 'Country : ' + customer.country;
    workSheet.getCell(18, 2).value = 'Phone : ' + customer.phone;
    if (customer.fax != '') {
        workSheet.getCell(19, 2).value = 'Fax : ' + customer.fax;
    }
    if (customer.taxId != '') {
        workSheet.getCell(20, 2).value = 'Vat : ' + customer.taxId;
    }

    workSheet.getCell(6, 6).value = 'Company : ' + customer.company;
    workSheet.getCell(7, 6).value = 'Address : ' + customer.address;
    workSheet.getCell(8, 6).value = 'Country : ' + customer.country;
    workSheet.getCell(9, 6).value = 'Phone : ' + customer.phone;
    if (customer.fax != '') {
        workSheet.getCell(10, 6).value = 'Fax : ' + customer.fax;
    }
    if (customer.taxId != '') {
        workSheet.getCell(11, 6).value = 'Vat : ' + customer.taxId;
    }


    workSheet.getCell(23, 2).value = shipmentDetail.customCompany;
    workSheet.getCell(24, 2).value = shipmentDetail.customOfficer;
    workSheet.getCell(25, 2).value = shipmentDetail.customPhone;
    workSheet.getCell(26, 2).value = shipmentDetail.customEmail;


    workSheet.getCell(23, 7).value = shipmentDetail.transporterCompany;
    workSheet.getCell(24, 7).value = shipmentDetail.transporterOfficer;
    workSheet.getCell(25, 7).value = shipmentDetail.transporterPhone;
    workSheet.getCell(27, 7).value = shipmentDetail.transporterEmail;

    let productTypes = '';

    for (let value of productCategories.filter(onlyUnique)) {

        productTypes += value + ',';

    }

    workSheet.getCell(29, 2).value = productTypes.substring(0, productTypes.length - 1);
    workSheet.getCell(30, 2).value = shipmentDetail.hsCode;
    workSheet.getCell(31, 2).value = shipmentDetail.kap;
    workSheet.getCell(32, 2).value = totalGrossWeight;
    workSheet.getCell(33, 2).value = totalNetWeight;
    workSheet.getCell(34, 2).value = totalM3;
    workSheet.getCell(37, 1).value = 'Malın Menşei : ' + shipmentDetail.madeBy;


    workSheet.getCell(29, 7).value = shipmentDetail.bank + ',' + shipmentDetail.brunch;
    workSheet.getCell(30, 7).value = paymentTerm;
    workSheet.getCell(31, 7).value = paymentBased;
    workSheet.getCell(32, 7).value = customer.country;
    workSheet.getCell(33, 7).value = shipmentDetail.producer1;
    workSheet.getCell(34, 7).value = shipmentDetail.producer2;
    workSheet.getCell(35, 7).value = shipmentDetail.producer3;
    workSheet.getCell(36, 7).value = shipmentDetail.producer4;

    workSheet.getCell(39, 4).value = shipmentDetail.customOffice;
    workSheet.getCell(40, 4).value = shipmentDetail.manifestPlace;
    workSheet.getCell(41, 4).value = shipmentDetail.sealNo;
    workSheet.getCell(42, 4).value = shipmentDetail.imoCode;
    workSheet.getCell(43, 4).value = shipmentDetail.shipNameVoyage;
    workSheet.getCell(44, 4).value = shipmentDetail.shipFlag;
    workSheet.getCell(45, 4).value = shipmentDetail.entrancePort;
    workSheet.getCell(46, 4).value = shipmentDetail.evacuationPort;
    workSheet.getCell(47, 4).value = shipmentDetail.vgmCutOff;
    workSheet.getCell(48, 4).value = shipmentDetail.manifestCutOff;
    workSheet.getCell(49, 4).value = shipmentDetail.agency;
    workSheet.getCell(50, 4).value = shipmentDetail.driver;
    workSheet.getCell(50, 5).value = shipmentDetail.truckPlate;
    workSheet.getCell(51, 4).value = shipmentDetail.goodImcoDetail;
    workSheet.getCell(52, 4).value = shipmentDetail.gTypeCode;

    workSheet.getCell(56, 1).value = shipmentDetail.description;

}


exports.getXcel = async (req, res, next) => {
    const customerId = req.params.customerId
    const orderId = req.params.orderId



    try {



        // const fileName = 'order-' + orderId + '.xlsx';
        // const xcelPath = path.join('data', 'xcel', fileName);




        res.status(200).json({
            message: 'Xcel',
            xcel: xcelPath,


        })



    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('shipmentController', 'MakeXcegetXcell', 1738, 500, err);

        next(err);
    }

}
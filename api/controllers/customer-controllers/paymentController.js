const mongodb = require('mongodb');
const Message = require('../../models/chat');
const CustomerLog = require('../../models/customerLog');
const Payment = require('../../models/payment');
const Cart = require('../../models/cart');
const OrderRetail = require('../../models/orderRetail');
const IndividualCustomer = require('../../models/individualCustomer');
const { validationResult } = require('express-validator/check');
const { timeStamp } = require('console');
const Iyzipay = require('iyzipay');
const errorService = require('../../classes/errorService');


const iyzipay = new Iyzipay({

    apiKey: "sandbox-NfK2qo3HfYro1YNn1qwJVYOHJZsDHizK",
    secretKey: "sandbox-ypeTE2AdDClsc4PMVB9wJc9YKBRVLwyl",
    uri: 'https://sandbox-api.iyzipay.com'
});




const ObjectId = mongodb.ObjectId;

exports.iyzicoInstallmentChecking = async (req, res, next) => {



    const conversationId = req.body.conversationId;
    const binNumber = req.body.binNumber;
    const price = req.body.price;

    let answer;

    try {

        iyzipay.installmentInfo.retrieve({
            locale: Iyzipay.LOCALE.TR,
            conversationId: conversationId,
            binNumber: binNumber,
            price: price
        }, function (err, result) {
            answer = result;
            res.status(201).json({ statusCode: 201, result: answer });
        });


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('paymentController', 'iyzicoInstallmentChecking', 26, 500, err);

        next(err);
    }
}

exports.saveSales = async (req, res, next) => {

    const sale = req.body.sale;

    try {

        const sale = new Payment({
            sale: sale

        });

        await sale.save();


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('paymentController', 'saveSales', 59, 500, err);
        next(err);
    }
}




exports.getPayments = async (req, res, next) => {

    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize || 50;
    const customer = req.query.customer || '';
    const lastname = req.query.lastname || '';
    const startMonth = req.query.startmonth || '1';
    const startDay = req.query.startday || '1';
    const startYear = req.query.startyear || '2000';
    const endMonth = req.query.endmonth || '12';
    const endDay = req.query.endday || '30';
    const endYear = req.query.endyear || '2030';



    let perPage = Number(pageSize);


    let queryTxt = "";
    let customerTxt = "";
    let lastnameTxt = "";

    startDate = new Date(startYear + "-" + startMonth + "-" + startDay);
    endDate = new Date(endYear + "-" + endMonth + "-" + endDay);

    if (customer != '') {
        if (customer != 'undefined') {
            customerTxt = '"buyer.name":{ "\$regex" : "' + customer + '", "\$options" : "i"},';
        }
    }

    if (lastname != '') {
        if (lastname != 'undefined') {
            lastnameTxt = '"buyer.surname":{ "\$regex" : "' + lastname + '", "\$options" : "i"},';
        }
    }


    queryTxt = '{' + customerTxt + lastnameTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';


    let query = JSON.parse(queryTxt);



    try {

        const totalPayment = await Payment.find(query).countDocuments();


        const payments = await Payment.find(query).sort({ createdAt: -1 });




        res.status(200).json({
            message: 'Fetched payments succesfully',
            payments: payments,
            totalPayment: totalPayment


        })


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('paymentController', 'getPayments', 85, 500, err);
        next(err);
    }
}


exports.getPayment = async (req, res, next) => {

    const paymentId = req.params.paymentId

    try {

        const payment = await Payment.findById(paymentId);

        res.status(200).json({
            message: 'Fetched payments succesfully',
            payment: payment


        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('paymentController', 'getPayment', 159, 500, err);
        next(err);
    }
}

exports.iyzicoPayment = async (req, res, next) => {

    const locale = req.body.locale;
    const conversationId = req.body.conversationId;
    const price = req.body.price;
    const paidPrice = req.body.paidPrice;
    const installment = req.body.installment;
    const basketId = req.body.basketId;
    const customerId = req.body.customerId;
    const referanceCode = req.body.referanceCode;
  

    paymentId = '';

    const paymentCard = JSON.parse(req.body.paymentCard);
    const buyer = JSON.parse(req.body.buyer);
    const shippingAddress = JSON.parse(req.body.shippingAddress);
    const billingAddress = JSON.parse(req.body.billingAddress);
    const basketItems = JSON.parse(req.body.basketItems);

    const lastLogin = await CustomerLog.find({ customerId: buyer.id }).sort({ createdAt: -1 }).limit(1);

    const invididualCustomer = await IndividualCustomer.findById(buyer.id);

    const lastLoginDate = new Date(lastLogin[0].createdAt);
    const registrationDate = new Date(invididualCustomer.createdAt);



    const customerLastLoginDate = lastLoginDate.getFullYear() + '-' + lastLoginDate.getMonth() + 1 + '-' + lastLoginDate.getDate() + ' ' + lastLoginDate.getHours() + ':' + lastLoginDate.getMinutes() + ':' + lastLoginDate.getSeconds();
    const customerRegistrationDate = registrationDate.getFullYear() + '-' + registrationDate.getMonth() + 1 + '-' + registrationDate.getDate() + ' ' + registrationDate.getHours() + ':' + registrationDate.getMinutes() + ':' + registrationDate.getSeconds();

    buyer.lastLoginDate = customerLastLoginDate;
    buyer.registrationDate = customerRegistrationDate;

    try {

        var request = {
            locale: locale,
            conversationId: conversationId,
            price: price,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            installment: installment,
            basketId: basketId,
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.LISTING,
            paymentCard: paymentCard,
            buyer: buyer,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress,
            basketItems: basketItems
        };




        iyzipay.payment.create(request, function (err, result) {

            if (result.status != 'failure') {

                for (let p of result.itemTransactions) {

                    p.unit = basketItems.find(x => x.id == p.itemId).unit;
                    p.unitPrice = basketItems.find(x => x.id == p.itemId).unitPrice;
                    p.name = basketItems.find(x => x.id == p.itemId).name;

                    basketItems.find(x => x.id == p.itemId).paymentTransactionId = p.paymentTransactionId;



                }
            } else {

                console.log(result)
            }





            if (result.status === "success") {

                result.status = "Paid";
        
            }


            const sale = new Payment({
                referanceCode: referanceCode,
                sale: result,
                buyer: buyer,
                shippingAddress: shippingAddress,
                billingAddress: billingAddress,
                basketItems: basketItems

            });

            returnPayment(sale).then(function (result) {

              


                if (result.sale.status === "Paid") {
                    for (let p of basketItems) {



                        Cart.findOneAndDelete({ customer: customerId, product: p.id }, function () { });

                    }
                }

                res.status(201).json({ statusCode: 201, result: result });
            });


        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('paymentController', 'iyzicoPayment', 182, 500, err);
        next(err);
    }

}


function returnPayment(payment) {
    return payment.save();
};


exports.iyzicoCancel = async (req, res, next) => {

    const locale = req.body.locale;
    const conversationId = req.body.conversationId;
    const iyzicoPaymentId = req.body.iyzicoPaymentId;
    const ip = req.body.ip;
    const paymentId = req.body.paymentId;
    const orderId = req.body.orderId;

    try {
        iyzipay.cancel.create({
            locale: Iyzipay.LOCALE.TR,
            conversationId: conversationId,
            paymentId: iyzicoPaymentId,
            ip: ip
        }, function (err, result) {



            console.log(result);



            findAndUpdatePayment(paymentId, result).then(function (_result) {
                findAndUpdateOrderRetail(orderId, result).then(function (bla) {

                    res.status(201).json({ statusCode: 201, result: result });

                })
            })


        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('paymentController', 'iyzicoCancel',317, 500, err);
        next(err);
    }


}


function findAndUpdatePayment(paymentId, result) {


    try {
        let _status = result.status;
        if (_status === 'success') {
            _status = 'Canceled';
        }


        const pirasa = Payment.updateOne({ _id: paymentId }, { 'sale.status': _status, errorMessage: result.errorMessage });


        return pirasa;
    } catch (err) {
        errorService.sendErrorNotificationViaEmail('paymentController', 'findAndUpdatePayment',363, 500, err);
        console.log(err)

    }

};



function findAndUpdateOrderRetail(orderId, result) {


    try {
        let _status = result.status;
        if (_status === 'success') {
            _status = 'Canceled';
        }




        const br = OrderRetail.updateOne({ _id: orderId }, { 'paymentStatus': _status });




        return br;
    } catch (err) {
        errorService.sendErrorNotificationViaEmail('paymentController', 'findAndUpdateOrderRetail',387, 500, err);
        console.log(err)

    }

};



exports.iyzicoRefund = async (req, res, next) => {


    const ip = req.body.ip;
    const price = req.body.price;
    const paymentTransactionId = req.body.paymentTransactionId;
    const locale = req.body.locale;
    const conversationId = req.body.conversationId;
    const paymentId = req.body.paymentId;
    const orderId = req.body.orderId;
    const productId = req.body.productId;



    try {
        await iyzipay.refund.create({
            locale: Iyzipay.LOCALE.TR,
            conversationId: conversationId,
            paymentTransactionId: paymentTransactionId,
            price: price,
            currency: Iyzipay.CURRENCY.TRY,
            ip: ip
        }, function (err, result) {

            console.log(result)


            findAndUpdateProductRefundStatus(paymentId, productId, result).then(function (_result) {
                findAndUpdateProductRefundStatusOnOrderDetail(orderId, productId, _result).then(function (bla) {

                    res.status(201).json({ statusCode: 201, result: result });

                })
            })

        });





    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('paymentController', 'iyzicoRefund',415, 500, err);

        next(err);
    }


}


findAndUpdateProductRefundStatus = async (paymentId, productId, _result) => {

    try {
        let _status = _result.status;
        if (_status === 'success') {
            _status = 'Refunded';
        }

        const oldPirasa = await Payment.findById(paymentId);
        const pirasa = await Payment.findById(paymentId);

        for (let p of pirasa.basketItems) {

            if (p.id === productId) {

                p.status = _status;

                if (_result.errorMessage != '') {
                    if (_result.errorMessage != null) {
                        p.errorMessage = _result.errorMessage;
                    }
                }

            }
        }
        oldPirasa.basketItems = pirasa.basketItems;

        const result = await oldPirasa.save();


        return _status;
    } catch (err) {
        errorService.sendErrorNotificationViaEmail('paymentController', 'findAndUpdateProductRefundStatus',469, 500, err);

        console.log(err)

    }

};



findAndUpdateProductRefundStatusOnOrderDetail = async (orderId, productId, _result) => {


    try {
        let _status = _result;
        if (_status === 'success') {
            _status = 'Refunded';
        }

        const oldOrder = await OrderRetail.findById(orderId);

        const newOrder = await OrderRetail.findById(orderId);

        for (let p of newOrder.products) {

            if (p.product._id === productId) {

                p.productStatus = _status;


                if (_result.errorMessage != '') {
                    if (_result.errorMessage != null) {
                        p.errorMessage = _result.errorMessage;
                    }
                }

            }
        }

        oldOrder.products = newOrder.products;




        const result = await oldOrder.save();

        return oldOrder;
    } catch (err) {
        errorService.sendErrorNotificationViaEmail('paymentController', 'findAndUpdateProductRefundStatusOnOrderDetail',511, 500, err);
        console.log(err)

    }

};


function updatePayment(paymentId) {
    return Payment.findById(paymentId);
};

exports.postPayment = async (req, res, next) => {

    const cart = JSON.parse(req.body.cart);


    const CC_OWNER = req.body.CC_OWNER;
    const CC_NUMBER = req.body.CC_NUMBER;
    const EXP_MONTH = req.body.EXP_MONTH;
    const EXP_YEAR = req.body.EXP_YEAR;
    const CC_CVV = req.body.CC_CVV;


    const BILL_FNAME = req.body.BILL_FNAME;
    const BILL_LNAME = req.body.BILL_LNAME;
    const BILL_EMAIL = req.body.BILL_EMAIL;
    const BILL_PHONE = req.body.BILL_PHONE;
    const BILL_FAX = req.body.BILL_FAX;
    const BILL_ADDRESS = req.body.BILL_ADDRESS;
    const BILL_ADDRESS2 = req.body.BILL_ADDRESS2;
    const BILL_ZIPCODE = req.body.BILL_ZIPCODE;
    const BILL_CITY = req.body.BILL_CITY;
    const BILL_COUNTRYCODE = req.body.BILL_COUNTRYCODE;
    const BILL_STATE = req.body.BILL_STATE;

    const DELIVERY_FNAME = req.body.DELIVERY_FNAME;
    const DELIVERY_LNAME = req.body.DELIVERY_LNAME;
    const DELIVERY_EMAIL = req.body.DELIVERY_EMAIL;
    const DELIVERY_PHONE = req.body.DELIVERY_PHONE;
    const DELIVERY_COMPANY = req.body.DELIVERY_COMPANY;
    const DELIVERY_ADDRESS = req.body.DELIVERY_ADDRESS;
    const DELIVERY_ADDRESS2 = req.body.DELIVERY_ADDRESS2;
    const DELIVERY_ZIPCODE = req.body.DELIVERY_ZIPCODE;
    const DELIVERY_CITY = req.body.DELIVERY_CITY;
    const DELIVERY_STATE = req.body.DELIVERY_STATE;
    const DELIVERY_COUNTRYCODE = req.body.DELIVERY_COUNTRYCODE;

    const SELECTED_INSTALLMENTS_NUMBER = req.body.SELECTED_INSTALLMENTS_NUMBER;
    const ORDER_SHIPPING = req.body.ORDER_SHIPPING;
    const CLIENT_IP = req.body.CLIENT_IP;



    try {



        var EndPointUrl = 'https://secure.payu.com.tr/order/alu/v3';

        SecretKey = 'SECRET_KEY';


        var moment = require('moment');



        date = moment(Date.now()).subtract(0, 'hours').utc().format('YYYY-MM-DD HH:mm:ss').toString();
        console.log(date)
        ORDER_REF = Math.floor(Math.random() * Math.floor(1000));


        var array = {
            'MERCHANT': "OPU_TEST",
            'LANGUAGE': "TR",
            'ORDER_DATE': date,
            'PAY_METHOD': "CCVISAMC",
            'BACK_REF': "http://www.backref.com.tr",
            'PRICES_CURRENCY': "TRY",
            'ORDER_REF': "Test" + ORDER_REF,
        }


        // array = {};

        array['CC_OWNER'] = CC_OWNER;
        array['CC_NUMBER'] = CC_NUMBER;
        array['EXP_MONTH'] = EXP_MONTH;
        array['EXP_YEAR'] = EXP_YEAR;
        array['CC_CVV'] = CC_CVV;


        array['BILL_FNAME'] = BILL_FNAME;
        array['BILL_LNAME'] = BILL_LNAME;
        array['BILL_EMAIL'] = BILL_EMAIL;
        array['BILL_PHONE'] = BILL_PHONE;
        array['BILL_FAX'] = BILL_FAX;
        array['BILL_ADDRESS'] = BILL_ADDRESS;
        array['BILL_ADDRESS2'] = BILL_ADDRESS2;
        array['BILL_ZIPCODE'] = BILL_ZIPCODE;
        array['BILL_CITY'] = BILL_CITY;
        array['BILL_COUNTRYCODE'] = BILL_COUNTRYCODE;
        array['BILL_STATE'] = BILL_STATE;

        array['DELIVERY_FNAME'] = DELIVERY_FNAME;
        array['DELIVERY_LNAME'] = DELIVERY_LNAME;
        array['DELIVERY_EMAIL'] = DELIVERY_EMAIL;
        array['DELIVERY_PHONE'] = DELIVERY_PHONE;
        array['DELIVERY_COMPANY'] = DELIVERY_COMPANY;
        array['DELIVERY_ADDRESS'] = DELIVERY_ADDRESS;
        array['DELIVERY_ADDRESS2'] = DELIVERY_ADDRESS2;
        array['DELIVERY_ZIPCODE'] = DELIVERY_ZIPCODE;
        array['DELIVERY_CITY'] = DELIVERY_CITY;
        array['DELIVERY_STATE'] = DELIVERY_STATE;
        array['DELIVERY_COUNTRYCODE'] = DELIVERY_COUNTRYCODE;

        array['SELECTED_INSTALLMENTS_NUMBER'] = SELECTED_INSTALLMENTS_NUMBER;
        array['ORDER_SHIPPING'] = ORDER_SHIPPING;
        array['CLIENT_IP'] = CLIENT_IP;



        let i = 0;

        array['ORDER_PNAME[' + i + ']'] = 'Test Ürünü';
        array['ORDER_PCODE[' + i + ']'] = 'Test Kodu';
        array['ORDER_PINFO[' + i + ']'] = 'Test Açıklaması';
        array['ORDER_PRICE[' + i + ']'] = '5';
        array['ORDER_VAT[' + i + ']'] = "18";
        array['ORDER_PRICE_TYPE[' + i + ']'] = 'GROSS';
        array['ORDER_QTY[' + i + ']'] = '1';

        // cart.forEach(product => {

        //     array['ORDER_PNAME[' + i + ']'] = product.product.turkishTitle;
        //     array['ORDER_PCODE[' + i + ']'] = product.product._id;
        //     array['ORDER_PINFO[' + i + ']'] = product.product.turkishTitle;
        //     array['ORDER_VAT[' + i + ']'] = "18";
        //     array['ORDER_PRICE_TYPE[' + i + ']'] = 'GROSS';
        //     array['ORDER_PRICE[' + i + ']'] = product.totalPrice;
        //     array['ORDER_QTY[' + i + ']'] = product.unit;
        //     i++;

        // });






        hashstring = '';
        var sortKeys = require('sort-keys');
        sorted = sortKeys(array)

        console.log(sorted)
        for (var k in sorted) {
            hashstring += array[k].length + array[k];
        }

        console.log(hashstring)

        var hash = require('crypto')
            , data = hashstring
            , secretkey = SecretKey;

        signature = hash.createHmac('md5', secretkey).update(data).digest('hex');
        array['ORDER_HASH'] = signature

        console.log("signature " + signature)


        var request = require("request");
        request.post(EndPointUrl, { form: array }, function (error, response, body) {
            console.log("hata " + error);
            console.log(body);

        });

        res.status(201).json({ statusCode: 201 });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}



test = async (cart,) => {



}


// exports.postPayment = async (req, res, next) => {

//     const cart = JSON.parse(req.body.cart);



//     try {


//         var paymentInfo;

//         // const MERCHANT = "'MERCHANT'" + ':' + '"OPU_TEST"';
//         // const LANGUAGE = "'LANGUAGE'" + ':' + '"TR"';
//         // const ORDER_DATE = "'ORDER_DATE'" + ':' + '"Date.now"';
//         // const PAY_METHOD = "'PAY_METHOD'" + ':' + '"CCVISAMC"';
//         // const BACK_REF = "'BACK_REF'" + ':' + '"http://www.backref.com.tr"';
//         // const PRICES_CURRENCY = "'PRICES_CURRENCY'" + ':' + '"TRY"';
//         // const SELECTED_INSTALLMENTS_NUMBER = "'SELECTED_INSTALLMENTS_NUMBER'" + ':' + '"1"';
//         // const ORDER_SHIPPING = "'ORDER_SHIPPING'" + ':' + '"5"';
//         // const CLIENT_IP = "'CLIENT_IP'" + ':' + '"127.0.0.1"';
//         // let ORDER_REF = "'ORDER_REF'" + ':' + '"127001"';

//         // let i = 0;

//         // let products = '';


//         // cart.forEach(product => {

//         //     products += "'ORDER_PNAME[" + i + "]'" + ':' + "'" + product.product.turkishTitle + "'" + ',';
//         //     products += "'ORDER_PCODE[" + i + "]'" + ':' + "'" + product.product._id + "'" + ',';
//         //     products += "'ORDER_PINFO[" + i + "]'" + ':' + "'" + product.product.turkishTitle + "'" + ',';
//         //     products += "'ORDER_PRICE[" + i + "]'" + ':' + "'" + product.unitPrice + "'" + ',';
//         //     products += "'ORDER_VAT[" + i + "]'" + ':' + '"18"' + ',';
//         //     products += "'ORDER_PRICE_TYPE[" + i + "]'" + ':' + "'GROSS'" + ',';
//         //     products += "'ORDER_PRICE[" + i + "]'" + ':' + "'" + product.totalPrice + "'" + ',';
//         //     products += "'ORDER_QTY[" + i + "]'" + ':' + "'" + product.unit + "'" + ',';
//         //     i++;

//         // });






//         // const CC_NUMBER = "'CC_NUMBER'" + ':' + "'4355084355084358'";
//         // const EXP_MONTH = "'EXP_MONTH'" + ':' + "'12'";
//         // const EXP_YEAR = "'EXP_YEAR'" + ':' + "'2022'";
//         // const CC_CVV = "'CC_CVV'" + ':' + "'000'";
//         // const CC_OWNER = "'CC_OWNER'" + ':' + "'000'";

//         // const BILL_FNAME = "'BILL_FNAME'" + ':' + "'Ad'";
//         // const BILL_LNAME = "'BILL_LNAME'" + ':' + "'Soyad'";
//         // const BILL_EMAIL = "'BILL_EMAIL'" + ':' + "'mail@mail.com'";
//         // const BILL_PHONE = "'BILL_PHONE'" + ':' + "'02129003711'";
//         // const BILL_FAX = "'BILL_FAX'" + ':' + "'02129003711'";
//         // const BILL_ADDRESS = "'BILL_ADDRESS'" + ':' + "'Birinci Adres satırı'";
//         // const BILL_ADDRESS2 = "'BILL_ADDRESS2'" + ':' + "'İkinci Adres satırı'";
//         // const BILL_ZIPCODE = "'BILL_ZIPCODE'" + ':' + "'34000'";
//         // const BILL_CITY = "'BILL_CITY'" + ':' + "'ISTANBUL'";
//         // const BILL_COUNTRYCODE = "'BILL_COUNTRYCODE'" + ':' + "'TR'";
//         // const BILL_STATE = "'BILL_STATE'" + ':' + "'Ayazağa'";


//         // const DELIVERY_FNAME = "'DELIVERY_FNAME'" + ':' + "'Ad'";
//         // const DELIVERY_LNAME = "'DELIVERY_LNAME'" + ':' + "'Soyad'";
//         // const DELIVERY_EMAIL = "'DELIVERY_EMAIL'" + ':' + "'mail@mail.com'";
//         // const DELIVERY_PHONE = "'DELIVERY_PHONE'" + ':' + "'02129003711'";
//         // const DELIVERY_COMPANY = "'DELIVERY_COMPANY'" + ':' + "'PayU Ödeme Kuruluşu A.Ş.'";
//         // const DELIVERY_ADDRESS = "'DELIVERY_ADDRESS'" + ':' + "'Birinci Adres satırı'";
//         // const DELIVERY_ADDRESS2 = "'DELIVERY_ADDRESS2'" + ':' + "'İkinci Adres satırı'";
//         // const DELIVERY_ZIPCODE = "'DELIVERY_ZIPCODE'" + ':' + "'34000'";
//         // const DELIVERY_CITY = "'DELIVERY_CITY'" + ':' + "'ISTANBUL'";
//         // const DELIVERY_STATE = "'DELIVERY_STATE'" + ':' + "'Ayazağa'";
//         // const DELIVERY_COUNTRYCODE = "'DELIVERY_COUNTRYCODE'" + ':' + "'TR'";

//         var moment = require('moment');
//         date = moment.utc().format('YYYY-MM-DD HH:mm:ss').toString();
//         var ORDER_REFerans = Math.floor(Math.random() * Math.floor(1000));




//         const BACK_REF = "http://www.backref.com.tr";
//         const BILL_ADDRESS = 'Birinci Adres satırı';
//         const BILL_ADDRESS2 = 'İkinci Adres satırı';
//         const BILL_CITY = 'ISTANBUL';
//         const BILL_COUNTRYCODE = 'TR';
//         const BILL_EMAIL = 'mail@mail.com';
//         const BILL_FAX = '02129003711';
//         const BILL_FNAME = 'Ad';
//         const BILL_LNAME = 'Soyad';
//         const BILL_PHONE = '02129003711';
//         const BILL_STATE = 'Ayazağa';
//         const BILL_ZIPCODE = '34000';
//         const CC_CVV = '000';
//         const CC_NUMBER = '4355084355084358';
//         const CC_OWNER = '000';
//         const CLIENT_IP = "127.0.0.1";
//         const DELIVERY_ADDRESS = 'Birinci Adres satırı';
//         const DELIVERY_ADDRESS2 = 'İkinci Adres satırı';
//         const DELIVERY_CITY = 'ISTANBUL';
//         const DELIVERY_COMPANY = 'PayU Ödeme Kuruluşu A.Ş.';
//         const DELIVERY_COUNTRYCODE = 'TR';
//         const DELIVERY_EMAIL = 'mail@mail.com';
//         const DELIVERY_FNAME = 'Ad';
//         const DELIVERY_LNAME = 'Soyad';
//         const DELIVERY_PHONE = '02129003711';
//         const DELIVERY_STATE = 'Ayazağa';
//         const DELIVERY_ZIPCODE = '34000';
//         const EXP_MONTH = '12';
//         const EXP_YEAR = '2022';
//         const LANGUAGE = "TR";
//         const MERCHANT = "OPU_TEST";
//         const ORDER_DATE = date;
//         const ORDER_PCODE0 = 'Test Kodu';
//         const ORDER_PCODE1 = 'Test Kodu-2';
//         const ORDER_PINFO0 = 'Test Açıklaması';
//         const ORDER_PINFO1 = 'Test Açıklaması-2';
//         const ORDER_PNAME0 = 'Test Ürünü';
//         const ORDER_PNAME1 = 'Test Ürünü-2';
//         const ORDER_PRICE0 = '5';
//         const ORDER_PRICE1 = '15';
//         const ORDER_PRICE_TYPE0 = 'NET';
//         const ORDER_PRICE_TYPE1 = 'GROSS';
//         const ORDER_QTY0 = '1';
//         const ORDER_QTY1 = '3';
//         const ORDER_REF = ORDER_REFerans;
//         const ORDER_SHIPPING = "5";
//         const ORDER_VAT0 = '18';
//         const ORDER_VAT1 = '24';
//         const PAY_METHOD = "CCVISAMC";
//         const PRICES_CURRENCY = "TRY";
//         const SELECTED_INSTALLMENTS_NUMBER = "1";


//         hashString = BACK_REF.length + BACK_REF + BILL_ADDRESS.length + BILL_ADDRESS + BILL_ADDRESS2.length +
//             BILL_ADDRESS2 + BILL_CITY.length + BILL_CITY + BILL_COUNTRYCODE.length + BILL_COUNTRYCODE +
//             BILL_EMAIL.length + BILL_EMAIL + BILL_FAX.length + BILL_FAX + BILL_FNAME.length + BILL_FNAME +
//             BILL_LNAME.length + BILL_LNAME + BILL_PHONE.length + BILL_PHONE + BILL_STATE.length + BILL_STATE +
//             BILL_ZIPCODE.length + BILL_ZIPCODE + CC_CVV.length + CC_CVV + CC_NUMBER.length + CC_NUMBER +
//             CC_OWNER.length + CC_OWNER + CLIENT_IP.length + CLIENT_IP + DELIVERY_ADDRESS.length + DELIVERY_ADDRESS +
//             DELIVERY_ADDRESS2.length + DELIVERY_ADDRESS2 + DELIVERY_CITY.length + DELIVERY_CITY + DELIVERY_COMPANY.length + DELIVERY_COMPANY +
//             DELIVERY_COUNTRYCODE.length + DELIVERY_COUNTRYCODE + DELIVERY_EMAIL.length + DELIVERY_EMAIL + DELIVERY_FNAME.length +
//             DELIVERY_FNAME + DELIVERY_LNAME.length + DELIVERY_LNAME + DELIVERY_PHONE.length + DELIVERY_PHONE + DELIVERY_STATE.length +
//             DELIVERY_ZIPCODE.length + DELIVERY_ZIPCODE + EXP_MONTH.length + EXP_MONTH + EXP_YEAR.length + EXP_YEAR +
//             LANGUAGE.length + LANGUAGE + MERCHANT.length + MERCHANT + ORDER_DATE.length + ORDER_DATE + ORDER_PCODE0.length +
//             ORDER_PCODE0 + ORDER_PCODE1.length + ORDER_PCODE1 + ORDER_PINFO0.length + ORDER_PINFO0 + ORDER_PINFO1.length +
//             ORDER_PNAME0.length + ORDER_PNAME0 + ORDER_PNAME1.length + ORDER_PNAME1 + ORDER_PRICE0.length + ORDER_PRICE0 +
//             ORDER_PRICE1.length + ORDER_PRICE1 + ORDER_PRICE_TYPE0.length + ORDER_PRICE_TYPE0 + ORDER_PRICE_TYPE1.length +
//             ORDER_PRICE_TYPE1 + ORDER_QTY0.length + ORDER_QTY0 + ORDER_QTY1.length + ORDER_QTY1 + ORDER_REF.length + ORDER_REF +
//             ORDER_SHIPPING.length + ORDER_SHIPPING + ORDER_VAT0.length + ORDER_VAT0 + ORDER_VAT1.length + ORDER_VAT1 + PAY_METHOD.length +
//             PAY_METHOD + PRICES_CURRENCY.length + PRICES_CURRENCY + SELECTED_INSTALLMENTS_NUMBER.length + SELECTED_INSTALLMENTS_NUMBER

//             SecretKey='SECRET_KEY';


//         var hash = require('crypto')
//         , data = hashString
//         , secretkey = SecretKey;

//     signature = hash.createHmac('md5', secretkey).update(data).digest('hex');
//     // array['ORDER_HASH'] = signature

//   await test();

//         res.status(201).json({ statusCode: 201 });

//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }

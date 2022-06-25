const mongodb = require('mongodb');
const Order = require('../models/order');
const DealerPdf = require('../models/dealerPdf');
const Email = require('../models/email');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const { y } = require('pdfkit');

const ObjectId = mongodb.ObjectId;
const errorService = require('../classes/errorService');



exports.sendMail = async (req, res, next) => {



    const to = req.body.to;
    const subject = req.body.subject;
    const text = req.body.text;
    const filename = req.body.filename;
    const path = req.body.path;
    const owner = req.body.owner;


    Email.find({ owner: owner })
        .then(emailSetting => {



            if (emailSetting === []) {

                const error = new Error('Could not find emailSetting for this Owner');
                err.statusCode = 404;
                throw error;
            }

            const transporter = nodemailer.createTransport({
                host: emailSetting[0].smtp,
                port: emailSetting[0].port,
                secure: emailSetting[0].secure,
                auth: {
                    user: emailSetting[0].userName,
                    pass: emailSetting[0].password
                }
            });

            const mailOptions = {
                from: emailSetting[0].userName,
                to: to,
                subject: subject,
                text: text,
                attachments: [{
                    filename: '1597037327797.xlsx',
                    path: 'C:\\Users\\fatih\\OneDrive\\Belgeler\\Nodejs\\order-system\\data\\xcel\\1597037327797.xlsx'
                }


                ]
            };
            let information;

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    information = error;
                    errorService.sendErrorNotificationViaEmail('emailController', 'sendMail', 39, 500, error);

                } else {
                    information = info.response;
                    console.log('email sent : ' + information);
                }
            })


            res.status(200).json({ information: information })


        }).catch(err => {
            if (!err.statusCode) {

                err.message = " Check the owner this mail"

            }
            errorService.sendErrorNotificationViaEmail('emailController', 'sendMail', 83, 500, err);

            next(err);

        });



}


exports.sendPdf = async (req, res, next) => {

    const orderId = req.body.orderId;
    const customerEmail = req.body.customerEmail;
    const owner = req.body.owner;

    const order = await Order
        .findById(orderId);

    const customerId = order.customerId;

    const invoiceName = 'order-' + order.id + '.pdf';
    const invoicePath = path.join('images', 'orderPDF', invoiceName);



    try {


        const pdfDoc = new PDFDocument({ autoFirstPage: false });

        const logo = path.join('data', 'nishmanlogotwo.jpg');



        pdfDoc.addPage({ margin: 10 });
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        let _now = new Date();

        pdfDoc.image(logo, 10, 3, { fit: [51, 36] }).stroke();

        pdfDoc.fontSize(12).font('Helvetica-Bold').text('ASiL GROUP iC ve DIS TiC. SAN. LTD. STi.', 65, 10);
        pdfDoc.fontSize(8).text('www.nishman.com.tr', 330, 12);
        pdfDoc.fontSize(8).text('P: +90 212 552 00 39', 420, 12);

        pdfDoc.fontSize(8).text('E: info@asilgroup.com.tr', 10, 12, { align: 'right' });


        let y = 40;

        pdfDoc.save().moveTo(10, y).lineTo(600, y).stroke(); //bottom

        pdfDoc.fontSize(10).font('Helvetica-Bold').text("ASiL GROUP iC ve DIS TiC. SAN. LTD. STi.", 10, y + 10);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Address : ", 10, y + 25);
        pdfDoc.fontSize(9).font('Helvetica').text("Kavakli Mah. Istanbul Cad. No:19/1", 75, y + 25);


        pdfDoc.fontSize(10).font('Helvetica-Bold').text("DELIVERY INFORMATIONS", 280, y + 10);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Country :", 280, y + 25);
        pdfDoc.fontSize(9).font('Helvetica').text(order.deliveryAddress.country, 325, y + 25);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Address :", 280, y + 38);
        pdfDoc.fontSize(9).font('Helvetica').text(order.deliveryAddress.address, 325, y + 38);

        pdfDoc.fontSize(8).font('Helvetica-Bold').text("PRICES ARE BASED ON " + order.paymentBased, 280, y + 94);



        pdfDoc.fontSize(9).font('Helvetica').text("Beylikdüzü 34520 / ISTANBUL / TURKIYE", 75, y + 38);


        pdfDoc.fontSize(8).font('Helvetica-Bold').text("PAYMENT TERM : " + order.paymentTerm + " BALANCE BEFORE SHIPMENT", 280, y + 107);
        // pdfDoc.fontSize(10).font('Helvetica-Bold').text("BEFORE SHIPMENT ", 306, y + 48);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Tax Id : ", 10, y + 53);
        pdfDoc.fontSize(9).font('Helvetica').text("BEYLIKDUZU VD / 0860550943", 75, y + 53);

        pdfDoc.fontSize(8).font('Helvetica-Bold').text("DELIVERY TIME : " + order.deliveryTime, 280, y + 120);



        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Bank Name : ", 10, y + 68);
        pdfDoc.fontSize(9).font('Helvetica').text(order.paymentBankAccount.bank, 75, y + 68);




        pdfDoc.fontSize(9).font('Helvetica-Bold').text(order.paymentBankAccount.currency + " Iban No : ", 10, y + 83);
        pdfDoc.fontSize(9).font('Helvetica').text(order.paymentBankAccount.ibanNo, 75, y + 83);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Account No : ", 10, y + 98);
        pdfDoc.fontSize(9).font('Helvetica').text(order.paymentBankAccount.accountNo, 75, y + 98);

        pdfDoc.fontSize(9).font('Helvetica-Bold').text("Branch : ", 10, y + 113);
        pdfDoc.fontSize(9).font('Helvetica').text(order.paymentBankAccount.branch, 75, y + 113);


        pdfDoc.fontSize(9).font('Helvetica-Bold').text("SWIFT CODE : ", 10, y + 128);
        pdfDoc.fontSize(9).font('Helvetica').text(order.paymentBankAccount.swiftCode, 75, y + 128);


        y = y + 113;

        pdfDoc.save().moveTo(10, y + 30).lineTo(600, y + 30).stroke(); //top
        pdfDoc.save().moveTo(10, y + 30).lineTo(10, y + 60).stroke(); //left
        pdfDoc.save().moveTo(10, y + 60).lineTo(600, y + 60).stroke(); //bottom
        pdfDoc.save().moveTo(600, y + 30).lineTo(600, y + 60).stroke(); //

        pdfDoc.save().moveTo(415, y + 30).lineTo(415, y + 60).stroke(); //
        pdfDoc.fontSize(13).font('Helvetica-Bold').text(order.customer, 15, y + 42);
        pdfDoc.fontSize(13).text('Date : ' + (_now.getMonth() + 1) + " / " + _now.getDate() + " / " + _now.getFullYear(), 440, y + 40);
        pdfDoc.save().moveTo(10, y + 85).lineTo(600, y + 85).stroke(); //bottom
        pdfDoc.save().moveTo(10, y + 60).lineTo(10, y + 85).stroke(); //left
        pdfDoc.fontSize(9).font('Helvetica-Bold').text('Description of Goods', 15, y + 70);
        // pdfDoc.save().moveTo(360, 60).lineTo(30, 85).stroke(); //
        pdfDoc.fontSize(9).font('Helvetica-Bold').text('Volume', 374, y + 70);
        pdfDoc.save().moveTo(370, y + 60).lineTo(370, y + 85).stroke(); //right

        // pdfDoc.fontSize(9).font('Helvetica-Bold').text('Boxes', 253, 70);
        // pdfDoc.save().moveTo(285, 60).lineTo(285, 85).stroke(); //right

        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Unit', 424, y + 65);
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Price', 423, y + 75);
        pdfDoc.save().moveTo(415, y + 60).lineTo(415, y + 85).stroke(); //right


        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Total', 456, y + 65);
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Unit', 457, y + 75);
        pdfDoc.save().moveTo(450, y + 60).lineTo(450, y + 85).stroke(); //right

        pdfDoc.fontSize(9).font('Helvetica-Bold').text('Boxes', 488, y + 70);
        pdfDoc.save().moveTo(485, y + 60).lineTo(485, y + 85).stroke(); //right

        // pdfDoc.fontSize(8).font('Helvetica-Bold').text('Total', 432, 65);
        // pdfDoc.fontSize(8).font('Helvetica-Bold').text('Volume', 430, 75);
        // pdfDoc.save().moveTo(465, 60).lineTo(465, 85).stroke(); //right

        // pdfDoc.fontSize(8).font('Helvetica-Bold').text('Total', 478, 65);
        // pdfDoc.fontSize(8).font('Helvetica-Bold').text('Weight', 476, 75);
        pdfDoc.save().moveTo(520, y + 60).lineTo(520, y + 85).stroke(); //right

        pdfDoc.fontSize(10).font('Helvetica-Bold').text('Total Price', 527, y + 70);

        pdfDoc.save().moveTo(600, y + 60).lineTo(600, y + 85).stroke(); //

        const products = order.products;

        let grandTotal = 0;
        x = 245;
        y = 238;
        line = 0;
        page = 1;
        limitOfLine = 25;
        products.forEach(prod => {


            if (page != 1) {
                limitOfLine = 36;

            }

            if (line == limitOfLine) {
                pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);
                pdfDoc.addPage({ margin: 10 });
                page++;
                x = 37;
                y = 30;
                line = 0;
                pdfDoc.save().moveTo(10, y).lineTo(600, y).stroke(); //top

                let _totalPrice = 0;

                _totalPrice = Number(prod.box) * Number(prod.product.quantityInBox) * Number(prod.unitPrice);


                grandTotal += _totalPrice;

                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom
                pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left


                pdfDoc.fontSize(8).font('Helvetica').text(prod.product.title, 15, x);





                if (prod.product.volumeEntity != 'Not') {
                    pdfDoc.fontSize(8).font('Helvetica').text(prod.product.volume + " " + prod.product.volumeEntity, 375, x);
                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length > 7) {
                    pdfDoc.fontSize(6).font('Helvetica').text(prod.product.volume, 375, x);

                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length <= 8) {
                    pdfDoc.fontSize(8).font('Helvetica').text(prod.product.volume, 375, x);
                }

                pdfDoc.save().moveTo(370, y).lineTo(370, y + 20).stroke(); //right

                pdfDoc.fontSize(7).font('Helvetica').text(prod.unitPrice + " " + prod.currency, 418, x);
                pdfDoc.save().moveTo(415, y).lineTo(415, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(prod.unit, 455, x);
                pdfDoc.save().moveTo(450, y).lineTo(450, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(prod.box, 489, x);
                pdfDoc.save().moveTo(485, y).lineTo(485, y + 20).stroke(); //right


                pdfDoc.save().moveTo(520, y).lineTo(520, y + 20).stroke(); //right




                pdfDoc.fontSize(9).font('Helvetica').text(_totalPrice.toFixed(2) + " " + prod.currency, 527, x);
                pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom

                pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);



                x += 20
                y += 20
                line++;


            } else {
                let _totalPrice = 0;

                _totalPrice = Number(prod.box) * Number(prod.product.quantityInBox) * Number(prod.unitPrice);


                grandTotal += _totalPrice;


                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom
                pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left


                pdfDoc.fontSize(8).font('Helvetica').text(prod.product.title, 15, x);




                if (prod.product.volumeEntity != 'Not') {
                    pdfDoc.fontSize(8).font('Helvetica').text(prod.product.volume + ' ' + prod.product.volumeEntity, 375, x);
                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length > 7) {
                    pdfDoc.fontSize(6).font('Helvetica').text(prod.product.volume, 375, x);

                }

                if (prod.product.volumeEntity == 'Not' && prod.product.volume.length <= 8) {
                    pdfDoc.fontSize(8).font('Helvetica').text(prod.product.volume, 375, x);
                }

                pdfDoc.save().moveTo(370, y).lineTo(370, y + 20).stroke(); //right

                pdfDoc.fontSize(7).font('Helvetica').text(prod.unitPrice + " " + prod.currency, 418, x);
                pdfDoc.save().moveTo(415, y).lineTo(415, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(prod.unit, 455, x);
                pdfDoc.save().moveTo(450, y).lineTo(450, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(prod.box, 489, x);
                pdfDoc.save().moveTo(485, y).lineTo(485, y + 20).stroke(); //right


                pdfDoc.save().moveTo(520, y).lineTo(520, y + 20).stroke(); //right




                pdfDoc.fontSize(9).font('Helvetica').text(_totalPrice.toFixed(2) + " " + prod.currency, 527, x);
                pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
                // pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom
                pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);
                x += 20
                y += 20
                line++;

            }


        });

        if (line != limitOfLine) {


            pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left
            pdfDoc.fontSize(9).font('Helvetica-Bold').text("Pallet : ", 15, x);
            pdfDoc.fontSize(9).font('Helvetica').text(order.pallet, 47, x);

            pdfDoc.fontSize(9).font('Helvetica-Bold').text("Total Volume : ", 70, x);
            pdfDoc.fontSize(9).font('Helvetica').text(order.totalVolume + ' m3', 133, x);

            pdfDoc.fontSize(9).font('Helvetica-Bold').text("Total Weight : ", 200, x);
            pdfDoc.fontSize(9).font('Helvetica').text(order.totalWeight.toFixed(2) + ' ' + order.totalWeightEntity, 260, x);

            pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom


            pdfDoc.save().moveTo(370, y).lineTo(370, y + 20).stroke(); //right
            pdfDoc.fontSize(9).font('Helvetica-Bold').text("Grand Total ", 390, x);
            // pdfDoc.save().moveTo(350, y).lineTo(350, y + 20).stroke(); //right

            pdfDoc.fontSize(8).font('Helvetica').text(order.totalProduct, 455, x);
            pdfDoc.save().moveTo(450, y).lineTo(450, y + 20).stroke(); //right

            pdfDoc.fontSize(8).font('Helvetica').text(order.totalBoxes, 489, x);
            pdfDoc.save().moveTo(485, y).lineTo(485, y + 20).stroke(); //right

            pdfDoc.save().moveTo(520, y).lineTo(520, y + 20).stroke(); //right

            pdfDoc.fontSize(9).font('Helvetica-Bold').text(grandTotal.toFixed(2) + " " + order.currency, 527, x);
            pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
            pdfDoc.save().moveTo(260, y + 20).lineTo(600, y + 20).stroke(); //bottom

            pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);

        }


        if (limitOfLine === 36 || limitOfLine === 25) {

            if (line == (limitOfLine)) {

                y = (28 * 20) + 82;
                pdfDoc.addPage({ margin: 10 });
                page++;

                y = 15;
                x = 22;
                pdfDoc.save().moveTo(10, y).lineTo(600, y).stroke(); //bottom
                pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left
                pdfDoc.fontSize(9).font('Helvetica-Bold').text("Pallet : ", 15, x);
                pdfDoc.fontSize(9).font('Helvetica').text(order.pallet, 47, x);

                pdfDoc.fontSize(9).font('Helvetica-Bold').text("Total Volume : ", 70, x);
                pdfDoc.fontSize(9).font('Helvetica').text(order.totalVolume + ' m3', 133, x);

                pdfDoc.fontSize(9).font('Helvetica-Bold').text("Total Weight : ", 200, x);
                pdfDoc.fontSize(9).font('Helvetica').text(order.totalWeight.toFixed(2) + ' ' + order.totalWeightEntity, 260, x);

                pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom


                pdfDoc.save().moveTo(380, y).lineTo(380, y + 20).stroke(); //right
                pdfDoc.fontSize(9).font('Helvetica-Bold').text("Grand Total ", 390, x);
                // pdfDoc.save().moveTo(350, y).lineTo(350, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(order.totalProduct, 455, x);
                pdfDoc.save().moveTo(450, y).lineTo(450, y + 20).stroke(); //right

                pdfDoc.fontSize(8).font('Helvetica').text(order.totalBoxes, 489, x);
                pdfDoc.save().moveTo(485, y).lineTo(485, y + 20).stroke(); //right

                // pdfDoc.fontSize(8).font('Helvetica').text(order.totalVolume + ' m3', 425, x);
                // pdfDoc.save().moveTo(465, y).lineTo(465, y + 20).stroke(); //right

                // pdfDoc.fontSize(8).font('Helvetica').text(order.totalWeight.toFixed(2) + ' ' + order.totalWeightEntity, 469, x);
                pdfDoc.save().moveTo(520, y).lineTo(520, y + 20).stroke(); //right

                pdfDoc.fontSize(9).font('Helvetica-Bold').text(grandTotal.toFixed(2) + " " + order.currency, 525, x);
                pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
                pdfDoc.save().moveTo(260, y + 20).lineTo(600, y + 20).stroke(); //bottom
                // pdfDoc.fontSize(8).text('www.nishman.com.tr', 510, 772);
                pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);




            }

            // if (line > (limitOfLine - 8)) {


            //     y = (28 * 20) + 82;
            //     pdfDoc.addPage({ margin: 10 });
            //     page++;
            //     // pdfDoc.fontSize(8).text('www.nishman.com.tr', 510, 772);
            //     pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);



            //     if (line === limitOfLine) {

            //         y = 10;
            //         x = 15;
            //         pdfDoc.save().moveTo(10, y).lineTo(10, y + 20).stroke(); //left
            //         pdfDoc.fontSize(9).font('Helvetica-Bold').text("Pallet : ", 15, x);
            //         pdfDoc.fontSize(9).font('Helvetica').text(order.pallet, 45, x);

            //         pdfDoc.fontSize(9).font('Helvetica-Bold').text("Total Volume : ", 70, x);
            //         pdfDoc.fontSize(9).font('Helvetica').text(order.totalVolume + ' m3', 133, x);

            //         pdfDoc.fontSize(9).font('Helvetica-Bold').text("Total Weight : ", 200, x);
            //         pdfDoc.fontSize(9).font('Helvetica').text(order.totalWeight.toFixed(2) + ' ' + order.totalWeightEntity, 260, x);

            //         pdfDoc.save().moveTo(10, y + 20).lineTo(600, y + 20).stroke(); //bottom


            //         pdfDoc.save().moveTo(380, y).lineTo(380, y + 20).stroke(); //right
            //         pdfDoc.fontSize(9).font('Helvetica-Bold').text("Grand Total ", 390, x);
            //         // pdfDoc.save().moveTo(350, y).lineTo(350, y + 20).stroke(); //right

            //         pdfDoc.fontSize(8).font('Helvetica').text(order.totalProduct, 460, x);
            //         pdfDoc.save().moveTo(455, y).lineTo(455, y + 20).stroke(); //right

            //         pdfDoc.fontSize(8).font('Helvetica').text(order.totalBoxes, 492, x);
            //         pdfDoc.save().moveTo(485, y).lineTo(485, y + 20).stroke(); //right

            //         // pdfDoc.fontSize(8).font('Helvetica').text(order.totalVolume + ' m3', 425, x);
            //         // pdfDoc.save().moveTo(465, y).lineTo(465, y + 20).stroke(); //right

            //         // pdfDoc.fontSize(8).font('Helvetica').text(order.totalWeight.toFixed(2) + ' ' + order.totalWeightEntity, 469, x);
            //         pdfDoc.save().moveTo(520, y).lineTo(520, y + 20).stroke(); //right

            //         pdfDoc.fontSize(9).font('Helvetica-Bold').text(grandTotal.toFixed(2) + " " + order.currency, 530, x);
            //         pdfDoc.save().moveTo(600, y).lineTo(600, y + 20).stroke(); //right
            //         pdfDoc.save().moveTo(260, y + 20).lineTo(600, y + 20).stroke(); //bottom
            //         // pdfDoc.fontSize(8).text('www.nishman.com.tr', 510, 772);
            //         pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);
            //     }

            // }


        }



        pdfDoc.end();

        const pdf = new DealerPdf({
            customerId: customerId,
            orderId: order.id
        });

        const pdfFile = await DealerPdf.find({ customerId: customerId.toString(), orderId: order.id.toString() });

        if (pdfFile.length == 0) {
            const result = await pdf.save();
        }





        // const to = req.body.to;
        // const subject = req.body.subject;
        // const text = req.body.text;
        // const filename = req.body.filename;
        // const path = req.body.path;
        // const owner = req.body.owner;


        const to = customerEmail;
        const subject = "Your Order has been Approved!!!";
        const text = "Your Order has been approved and your proformo is attached on this e-mail please check the attachments"

        let emailInformation;

        Email.find({ owner: owner })
            .then(emailSetting => {



                if (emailSetting === []) {

                    const error = new Error('Could not find emailSetting for this Owner');
                    err.statusCode = 404;
                    throw error;
                }


                const transporter = nodemailer.createTransport({
                    host: emailSetting[0].smtp,
                    port: emailSetting[0].port,
                    secure: emailSetting[0].secure,
                    auth: {
                        user: emailSetting[0].userName,
                        pass: emailSetting[0].password
                    }
                });

                const mailOptions = {
                    from: emailSetting[0].userName,
                    to: to,
                    subject: subject,
                    text: text,
                    attachments: [{
                        filename: invoiceName,
                        path: invoicePath
                    }]
                };


                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        emailInformation = error;
                        errorService.sendErrorNotificationViaEmail('emailController', 'sendPDF', 595, 500, error);
                    } else {
                        // emailInformation = info.response;
                        emailInformation = 'Proforma has been sended to the customer';
                        // console.log('email sent : ' + emailInformation);
                    }

                    res.status(200).json({ message: 'Pdf .', emailInformation: emailInformation })

                });



            });



    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }

        errorService.sendErrorNotificationViaEmail('emailController', 'sendPDF', 100, 500, err);

        next(err);
    }










    //         res.status(200).json({ information: information })


    //     }).catch(err => {
    //         if (!err.statusCode) {

    //             err.message = " Check the owner this mail"

    //         }
    //         next(err);

    //     });




}






exports.getEmails = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const perPage = 200;
    let totalItems;

    try {
        const totalItems = await Email.find().countDocuments();
        const emails = await Email.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched emails succesfully',
            emails: emails,
            totalItems: totalItems
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('emailController', 'getEmails', 657, 500, error);
        next(err);
    }

}

exports.getEmail = (req, res, next) => {
    const emailId = req.params.emailId


    Email
        .findById(emailId)
        .then(email => {

            if (!email) {

                const error = new Error('Could not find email');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'email fetched.', email: email })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
        errorService.sendErrorNotificationViaEmail('emailController', 'getEmail', 686, 500, error);

            next(err);

        });

}

exports.postAddEmail = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {

        const email = new Email({
            owner: req.body.owner,
            smtp: req.body.smtp,
            port: req.body.port,
            secure: req.body.secure,
            userName: req.body.userName,
            password: req.body.password
        });
        const result = await email.save();
        res.status(201).json({ statusCode: 201, message: 'Email created!', emailId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('emailController', 'postAddEmail', 718, 500, error);

        next(err);
    }
}

exports.putUpdateEmail = async (req, res, next) => {
    const emailId = req.params.emailId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    const newEmail = new Email({
        owner: req.body.owner,
        smtp: req.body.smtp,
        port: req.body.port,
        secure: req.body.secure,
        userName: req.body.userName,
        password: req.body.password
    });


    try {
        const oldEmail = await (await Email.findById(emailId));
        if (!oldEmail) {
            const error = new Error('Could not find custom.');
            error.statusCode = 404;
            throw error;
        }


        oldEmail.owner = newEmail.owner;
        oldEmail.smtp = newEmail.smtp;
        oldEmail.port = newEmail.port;
        oldEmail.secure = newEmail.secure;
        oldEmail.userName = newEmail.userName;
        oldEmail.password = newEmail.password;






        const result = await oldEmail.save();

        res.status(200).json({ message: 'Email updated!', email: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('emailController', 'putUpdateEmail', 751, 500, error);

        next(err);
    }
};

exports.deleteEmail = async (req, res, next) => {
    const emailId = req.params.emailId;


    try {
        const email = await Email.findById(emailId);

        if (!email) {
            const error = new Error('Could not find email.');
            error.statusCode = 404;
            throw error;
        }


        await Email.findByIdAndRemove(emailId);

        res.status(200).json({ message: 'Deleted email.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('emailController', 'deleteEmail', 804, 500, error);

        next(err);
    }
};
























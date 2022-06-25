const IndividualCustomer = require('../../models/individualCustomer');
const CustomerLog = require('../../models/customerLog');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const Email = require('../../models/email');
const Product = require('../../models/product');
const ProductCountryPrice = require('../../models/productCountryPrice');
const mongodb = require('mongodb');
const Barber = require('../../models/individualCustomer');
const NotificationEmail = require('../../models/notificationEmail');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Contact = require('../../models/contact');
const errorService = require('../../classes/errorService');


exports.signup = async (req, res, next) => {



    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }
    const email = req.body.email;
    const name = req.body.name;
    const surname = req.body.surname;
    const phone = req.body.phone;
    const company = req.body.company;
    const password = req.body.password;
    const tcId = req.body.tcId;
    const taxPlace = req.body.taxPlace;
    const taxNo = req.body.taxNo;
    const openAddress = req.body.openAddress;
    const city = req.body.city;
    const state = req.body.state;
    const countryCode = req.body.countryCode;
    const country = req.body.country;
    const ip = req.body.ip;

   

    try {

        const hashedPw = await bcrypt.hash(password, 12);

        const individualCustomer = new IndividualCustomer({
            email: email,
            password: hashedPw,
            name: name,
            surname: surname,
            ip: ip,
            phone: phone,
            taxPlace: taxPlace,
            taxNo: taxNo,
            tcId: tcId,
            city:city,
            state:state,
            openAddress: openAddress,
            company: company


        });
        const result = await individualCustomer.save();


        const contact = new Contact({
            customer: result._id,
            addressName: company,
            name: name,
            lastName: surname,
            identityNumber: tcId,
            email: email,
            phone: phone,
            company: company,
            addressOne: openAddress,
            taxPlace: taxPlace,
            taxNo: taxNo,            
            city: city,
            countryCode: countryCode,
            country: country,
            state: state


        });


        const _result = await contact.save();


        let _emails = '';

        const emails = await NotificationEmail.find({ whatFor: 'NewBarber' });


        for (let email of emails) {

            _emails += email.email + ',';
        }





        await sendActivationMail(_emails, company, name, surname, phone, email);

        res.status(201).json({ message: 'User created!', userId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            
        }

        errorService.sendErrorNotificationViaEmail('individualCustomerController','signup',20,0,err);

        next(err);
    }
}


exports.login = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const customerIp = req.body.ip;
    let loadedUser;

    IndividualCustomer.findOne({ email: email })
        .then(customer => {
            if (!customer) {
                const error = new Error('Kullanıcı bulunamadı');
                error.statusCode = 401;
                throw error;
            }


            if (customer.active === false) {
                const error = new Error('Üyeliğiniz aktif değildir.');
               
                error.statusCode = 403;

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
                    userId: loadedUser._id.toString()
                },
                'secretyenidunya',
                { expiresIn: '10h' }

            );


            const customerLog = new CustomerLog({
                customerId: loadedUser._id,
                email: email,
                customerType: 'barber',
                name: loadedUser.name,
                surname: loadedUser.surname,
                ip: customerIp

            });

            customerLog.save();


            res.status(200).json({ token: token, userId: loadedUser._id.toString(), name: loadedUser.name, surname: loadedUser.surname })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('individualCustomerController','login',124,0,err);

            next(err);
        });

}

exports.putUploadDocumentImage = async (req, res, next) => {
    const registerId = req.params.registerId;


    if (!req.file) {
        console.log(req.file);

        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path.replace("\\", "/");
    console.log(imageUrl)

    try {
        const customer = await (await IndividualCustomer.findById(registerId));
        if (!customer) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            errorService.sendErrorNotificationViaEmail('individualCustomerController','putUploadDocumentImage',195,404,error);

            throw error;
        }


        // const newXcelFile = path.join('data', 'xcel', newXcelFilename);



        customer.document = imageUrl;


        const result = await customer.save();

     

        res.status(200).json({ message: 'Customer updated!', customer: result, document: result.document });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
           
        }

        errorService.sendErrorNotificationViaEmail('individualCustomerController','putUploadDocumentImage',195,500,err);

        next(err);
    }
};


exports.getBarbers = async (req, res, next) => {



    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const product = req.query.name || '';
    const perPage = Number(pageSize);



    let productTxt = '{}';

    if (product != '') {
        if (product != 'undefined') {
            productTxt = '{"name":{ "\$regex" : "' + product + '", "\$options" : "i"}}';
        }
    }

    let query = JSON.parse(productTxt);



    try {
        const totalBarber = await Barber.find(query).countDocuments();
        const barbers = await Barber.find(query)
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });




        res.status(200).json({
            message: 'Fetched rawMaterials succesfully',
            barbers: barbers,
            totalItem: totalBarber
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          
        }
        errorService.sendErrorNotificationViaEmail('individualCustomerController','putUploadDocumentImage',243,0,err);

        next(err);
    }

}



exports.getBarber = (req, res, next) => {
    const barberId = req.params.barberId


    Barber
        .findById(barberId)
        .then(barber => {

            if (!barber) {

                const error = new Error('Could not find Barber');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'barber fetched.', barber: barber })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;

            }
            errorService.sendErrorNotificationViaEmail('individualCustomerController','getBarber',294,0,err);

            next(err);

        });

}

exports.postAddBarber = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {


        const barber = new Barber({
            name: req.body.name,
            surname: req.body.surname,
            company: req.body.company,
            taxPlace: req.body.taxPlace,
            tcId: req.body.tcId,
            taxNo: req.body.taxNo,
            openAddress: req.body.openAddress,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            ip: req.body.ip,
            active: req.body.active
        });
        const result = await barber.save();
        res.status(201).json({ statusCode: 201, message: 'Barber created!', barberId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;

        }
        errorService.sendErrorNotificationViaEmail('individualCustomerController','postAddBarber',326,0,err);

        next(err);
    }
}

exports.putUpdateBarber = async (req, res, next) => {
    const barberId = req.params.barberId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        errorService.sendErrorNotificationViaEmail('individualCustomerController','putUpdateBarber',366,422,error);

        throw error;
    }
    const newBarber = new Barber({
        name: req.body.name,
        surname: req.body.surname,
        company: req.body.company,
        tcId: req.body.tcId,
        taxPlace: req.body.taxPlace,
        taxNo: req.body.taxNo,
        openAddress: req.body.openAddress,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        ip: req.body.ip,
        active: req.body.active
    });





    try {
        const oldBarber = await (await Barber.findById(barberId));
        if (!oldBarber) {
            const error = new Error('Could not find RawMaterial.');
            error.statusCode = 404;
            throw error;
        }


        oldBarber.name = newBarber.name;
        oldBarber.surname = newBarber.surname;
        oldBarber.company = newBarber.company;
        oldBarber.tcId = newBarber.tcId;
        oldBarber.taxPlace = newBarber.taxPlace;
        oldBarber.taxNo = newBarber.taxNo;
        oldBarber.openAddress = newBarber.openAddress;
        oldBarber.email = newBarber.email;
        oldBarber.phone = newBarber.phone;
        oldBarber.password = newBarber.password;
        oldBarber.ip = newBarber.ip;
        oldBarber.active = newBarber.active;

        // await sendCustomerPricePdf(oldBarber._id, oldBarber.company, oldBarber.email);

        const result = await oldBarber.save();

        // if (result.active === true) {

        //     await sendActivationApproveMail(result.email, result._id);
        // }

        res.status(200).json({ message: 'Barber updated!', barber: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
           
        }
        errorService.sendErrorNotificationViaEmail('individualCustomerController','putUpdateBarber',366,0,err);

        next(err);
    }
};

exports.deleteBarber = async (req, res, next) => {
    const barberId = req.params.barberId;
    try {
        const barber = await Barber.findById(barberId);

        if (!barber) {
            const error = new Error('Could not find Raw Material.');
            error.statusCode = 404;
            throw error;
        }


        await Barber.findByIdAndRemove(barberId);

        res.status(200).json({ message: 'Deleted Barber.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;

        }
        errorService.sendErrorNotificationViaEmail('individualCustomerController','deleteBarber',437,0,err);

        next(err);
    }
};


exports.getSendPricePdfToBarber = async (req, res, next) => {
    const barberId = req.params.barberId;
    const activate = req.params.activate;



    let result;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        errorService.sendErrorNotificationViaEmail('individualCustomerController','getSendPricePdfToBarber',463,422,error);
        throw error;
    }


    try {
        const oldBarber = await (await Barber.findById(barberId));
        if (!oldBarber) {
            const error = new Error('Could not find Barber.');
            error.statusCode = 404;
            throw error;
        }



        if (activate === 'true') {

            await sendCustomerPricePdf(oldBarber._id, oldBarber.company, oldBarber.email);
            oldBarber.mailSended === true;
            result = await oldBarber.save();

        }


        res.status(200).json({ message: 'Barber updated!', barber: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            
        }
        errorService.sendErrorNotificationViaEmail('individualCustomerController','getSendPricePdfToBarber',463,0,err);

        next(err);
    }
};

sendActivationApproveMail = async (customerEmail, customerId) => {

    await Email.find({ owner: 'noreply' })
        .then(emailSetting => {

            console.log(emailSetting)

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
                },
                tls: {
                    // do not fail on invalid certs
                    rejectUnauthorized: false
                }
            });

            const mailOptions = {
                from: emailSetting[0].userName,
                to: customerEmail,
                subject: 'Nishman aktivasyon maili',
                html: '<div> <h2> Nishman hesabınız onaylanmıştır </h2><br/>  <p> Aşşağıdaki linke tıklayarak sisteme giriş yapabilirsiniz.</p> <br/> <a  href="http://localhost:6600/login/"> Giriş </a> </div>'
            };
            let information;

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    information = error;
                    errorService.sendErrorNotificationViaEmail('individualCustomerController','sendActivationApproveMail',510,500,error);
      
                } else {
                    information = info.response;
                    console.log('email sent : ' + information);
                }
            });


        });


}


sendActivationMail = async (adminEmail, barberCompany, barberName, barberSurname, barberPhone, barberEmail) => {

    await Email.find({ owner: 'noreply' })
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
                },
                tls: {
                    // do not fail on invalid certs
                    rejectUnauthorized: false
                }

            });

            const mailOptions = {
                from: emailSetting[0].userName,
                to: adminEmail,
                subject: 'Nishman yeni berber kayıt bildirim maili',
                html: '<div> <h2> Nishman Yeni Berber Kaydı Bildirimi  </h2><br/>  <p> Aşşağıda bilgileri yazan berber aktivasyon beklemektedir.</p> <br/> <table> <tr> <td> Firma </td> <td> ' + barberCompany + ' </td> </tr> <tr> <td> Firma Sahibi Adı : </td> <td> ' + barberName + ' </td></tr> <tr> <td> Firma Sahibi Soyadı :  </td> <td> ' + barberSurname + ' </td> </tr> <tr> <td> Telefon : </td> <td> ' + barberPhone + ' </td> </tr> <tr> <td> Email : </td> <td> ' + barberEmail + ' </td> </tr>   </table>  </div>'
            };
            let information;

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    information = error;
                    errorService.sendErrorNotificationViaEmail('individualCustomerController','sendActivationMail',564,500,error);
      
                } else {
                    information = info.response;
                    console.log('email sent : ' + information);
                }
            });


        });


}


exports.activate = async (req, res, next) => {

    const customerId = req.body.customerId;

    try {

        let account = await IndividualCustomer.findById(customerId);

        account.activate = true;

        await account.save();

        res.status(200).json({ activation: true })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          
        }
        errorService.sendErrorNotificationViaEmail('individualCustomerController','activate',620,0,err);
      
        next(err);
    };

}








sendCustomerPricePdf = async (customerId, customerCompany, customerEmail) => {




    const fileName = customerCompany + '.pdf';
    const invoicePath = path.join('images', 'customerPrice', fileName);

    console.log('fileName = ' + fileName)

    console.log('invoicePath = ' + invoicePath)


    try {


        const pdfDoc = new PDFDocument({ autoFirstPage: false });

        const logo = path.join('data', 'nishmanlogotwo.jpg');



        pdfDoc.addPage({ margin: 10 });
        pdfDoc.fontSize(8).font('Helvetica').text('1', 595, 772);
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        let _now = new Date();

        pdfDoc.image(logo, 10, 12, { fit: [51, 36] }).stroke();
        pdfDoc.fontSize(12).font('Helvetica-Bold').text('ASiL GROUP iC ve DIS TiC. SAN. LTD. STi.', 65, 17);
        pdfDoc.fontSize(8).text('www.nishman.com.tr', 330, 17);
        pdfDoc.fontSize(8).text('P: +90 212 552 00 39', 420, 17);
        pdfDoc.fontSize(8).text('E: info@asilgroup.com.tr', 10, 17, { align: 'right' });


        let y = 40;

        y = y - 20;

        pdfDoc.save().moveTo(10, y + 30).lineTo(600, y + 30).stroke(); //top
        pdfDoc.save().moveTo(10, y + 30).lineTo(10, y + 60).stroke(); //left
        pdfDoc.save().moveTo(10, y + 60).lineTo(600, y + 60).stroke(); //bottom
        pdfDoc.save().moveTo(600, y + 30).lineTo(600, y + 60).stroke(); //
        pdfDoc.save().moveTo(430, y + 30).lineTo(430, y + 60).stroke(); //
        pdfDoc.fontSize(13).font('Helvetica-Bold').text(customerCompany, 15, y + 42);
        pdfDoc.fontSize(13).text('Date : ' + (_now.getMonth() + 1) + " / " + _now.getDate() + " / " + _now.getFullYear(), 455, y + 40);
        pdfDoc.save().moveTo(10, y + 85).lineTo(600, y + 85).stroke(); //bottom
        pdfDoc.save().moveTo(10, y + 60).lineTo(10, y + 85).stroke(); //left
        pdfDoc.fontSize(9).font('Helvetica-Bold').text('Ürün Adi', 15, y + 70);
        pdfDoc.save().moveTo(430, y + 60).lineTo(430, y + 85).stroke(); //right
        pdfDoc.fontSize(9).font('Helvetica-Bold').text('Miktar', 450, y + 70);
        pdfDoc.save().moveTo(492, y + 60).lineTo(492, y + 85).stroke(); //right
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Bayii', 502, y + 65);
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Alis', 505, y + 75);
        pdfDoc.save().moveTo(535, y + 60).lineTo(535, y + 85).stroke(); //right
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Bayii', 557, y + 65);
        pdfDoc.fontSize(8).font('Helvetica-Bold').text('Satis', 557, y + 75);
        pdfDoc.save().moveTo(600, y + 60).lineTo(600, y + 85).stroke(); //

        const products = await Product.find().sort({ order: 1 });

        x = 112;
        y = 105;
        line = 0;
        page = 1;
        limitOfLine = 21;
        products.forEach(prod => {

            let productTitle = prod.title.replace(/İ/g, 'I').toLowerCase().trimEnd().trimStart().replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/i/g, 'ı').replace(/ç/g, 'c').replace(/ü/g, 'u').replace(/ö/g, 'o');

            productTitle = productTitle.toUpperCase();

            if (page != 1) {
                limitOfLine = 24;
            }

            if (line == limitOfLine) {

                pdfDoc.addPage({ margin: 2 });
                page++;
                x = 20;
                y = 13;
                line = 0;
                pdfDoc.fontSize(8).font('Helvetica').text(page, 595, 772);
                pdfDoc.save().moveTo(10, y).lineTo(600, y).stroke(); //top
                // if (prod.image[0] != 'undefined') {
                //     if (prod.image[0] != undefined) {
                //         imagee = prod.image[0].split('/')[1];
                //         imageUrl = 'data\\' + imagee + '';

                //         pdfDoc.image(imageUrl, 12, x, { fit: [40, 40] }).stroke();
                //     }
                // }


                if (prod.colors.length != 0) {

                    for (let _color of prod.colors) {


                        pdfDoc.save().moveTo(10, y + 30).lineTo(600, y + 30).stroke(); //bottom

                        let __color = _color.color.replace(/İ/g, 'I').toLowerCase().trimEnd().trimStart().replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/i/g, 'ı').replace(/ç/g, 'c').replace(/ü/g, 'u').replace(/ö/g, 'o');

                        __color = __color.toUpperCase();


                        pdfDoc.fontSize(8).font('Helvetica').text(productTitle + ' - ' + __color, 15, x + 5);
                        pdfDoc.save().moveTo(430, y).lineTo(430, y + 30).stroke(); //right
                        if (_color.volumeEntity != 'Not') {
                            pdfDoc.fontSize(8).font('Helvetica').text(_color.volume + ' ' + _color.volumeEntity, 435, x + 5);
                        }
                        if (_color.volumeEntity == 'Not' && _color.volume.length > 7) {
                            pdfDoc.fontSize(6).font('Helvetica').text(_color.volume, 435, x + 5);
                        }
                        if (_color.volumeEntity == 'Not' && _color.volume.length <= 8) {
                            pdfDoc.fontSize(8).font('Helvetica').text(_color.volume, 435, x + 5);
                        }
                        pdfDoc.save().moveTo(492, y).lineTo(492, y + 30).stroke(); //right
                        pdfDoc.fontSize(8).font('Helvetica').text(_color.salePrice + ' ' + _color.salePriceCurrency, 502, x + 5);
                        pdfDoc.save().moveTo(535, y).lineTo(535, y + 30).stroke(); //right      
                        pdfDoc.fontSize(8).font('Helvetica-Bold').text(_color.barberSellingPrice + ' ' + _color.barberSellingPriceCurrency, 557, x + 5);
                        pdfDoc.save().moveTo(600, y).lineTo(600, y + 30).stroke(); //
                        pdfDoc.save().moveTo(10, y).lineTo(10, y + 30).stroke(); //left
                        x += 30
                        y += 30
                        line++;
                    }

                }


                if (prod.sizes.length != 0) {

                    for (let _size of prod.sizes) {

                        pdfDoc.save().moveTo(10, y + 30).lineTo(600, y + 30).stroke(); //bottom

                        pdfDoc.fontSize(8).font('Helvetica').text(productTitle, 15, x + 5);
                        pdfDoc.save().moveTo(430, y).lineTo(430, y + 30).stroke(); //right
                        if (_size.volumeEntity != 'Not') {
                            pdfDoc.fontSize(8).font('Helvetica').text(_size.volume + ' ' + _size.volumeEntity, 435, x + 5);
                        }
                        if (_size.volumeEntity == 'Not' && _size.volume.length > 7) {
                            pdfDoc.fontSize(6).font('Helvetica').text(_size.volume, 435, x + 5);
                        }
                        if (_size.volumeEntity == 'Not' && _size.volume.length <= 8) {
                            pdfDoc.fontSize(8).font('Helvetica').text(_size.volume, 435, x + 5);
                        }
                        pdfDoc.save().moveTo(492, y).lineTo(492, y + 30).stroke(); //right
                        pdfDoc.fontSize(8).font('Helvetica').text(_size.salePrice + ' ' + _size.salePriceCurrency, 502, x + 5);
                        pdfDoc.save().moveTo(535, y).lineTo(535, y + 30).stroke(); //right      
                        pdfDoc.fontSize(8).font('Helvetica-Bold').text(_size.barberSellingPrice + ' ' + _size.barberSellingPriceCurrency, 557, x + 5);
                        pdfDoc.save().moveTo(600, y).lineTo(600, y + 30).stroke(); //
                        pdfDoc.save().moveTo(10, y).lineTo(10, y + 30).stroke(); //left
                        x += 30
                        y += 30
                        line++;
                    }

                }


            } else {



                if (prod.colors.length != 0) {

                    for (let _color of prod.colors) {




                        pdfDoc.save().moveTo(10, y + 30).lineTo(600, y + 30).stroke(); //bottom


                        let __color = _color.color.replace(/İ/g, 'I').toLowerCase().trimEnd().trimStart().replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/i/g, 'ı').replace(/ç/g, 'c').replace(/ü/g, 'u').replace(/ö/g, 'o');

                        __color = __color.toUpperCase();

                        pdfDoc.fontSize(8).font('Helvetica').text(productTitle + ' - ' + __color, 15, x + 5);
                        pdfDoc.save().moveTo(430, y).lineTo(430, y + 30).stroke(); //right
                        if (_color.volumeEntity != 'Not') {
                            pdfDoc.fontSize(8).font('Helvetica').text(_color.volume + ' ' + _color.volumeEntity, 435, x + 5);
                        }
                        if (_color.volumeEntity == 'Not' && _color.volume.length > 7) {
                            pdfDoc.fontSize(6).font('Helvetica').text(_color.volume, 435, x + 5);
                        }
                        if (_color.volumeEntity == 'Not' && _color.volume.length <= 8) {
                            pdfDoc.fontSize(8).font('Helvetica').text(_color.volume, 435, x + 5);
                        }
                        pdfDoc.save().moveTo(492, y).lineTo(492, y + 30).stroke(); //right
                        pdfDoc.fontSize(8).font('Helvetica').text(_color.salePrice + ' ' + _color.salePriceCurrency, 502, x + 5);
                        pdfDoc.save().moveTo(535, y).lineTo(535, y + 30).stroke(); //right      
                        pdfDoc.fontSize(8).font('Helvetica-Bold').text(_color.barberSellingPrice + ' ' + _color.barberSellingPriceCurrency, 557, x + 5);
                        pdfDoc.save().moveTo(600, y).lineTo(600, y + 30).stroke(); //

                        pdfDoc.save().moveTo(10, y).lineTo(10, y + 30).stroke(); //left
                        x += 30
                        y += 30
                        line++;


                    }
                }

                if (prod.sizes.length != 0) {

                    for (let _size of prod.sizes) {


                        pdfDoc.save().moveTo(10, y + 30).lineTo(600, y + 30).stroke(); //bottom
                        pdfDoc.fontSize(8).font('Helvetica').text(productTitle, 15, x + 5);
                        pdfDoc.save().moveTo(430, y).lineTo(430, y + 30).stroke(); //right
                        if (_size.volumeEntity != 'Not') {
                            pdfDoc.fontSize(8).font('Helvetica').text(_size.volume + ' ' + _size.volumeEntity, 435, x + 5);
                        }
                        if (_size.volumeEntity == 'Not' && _size.volume.length > 7) {
                            pdfDoc.fontSize(6).font('Helvetica').text(_size.volume, 435, x + 5);
                        }
                        if (_size.volumeEntity == 'Not' && _size.volume.length <= 8) {
                            pdfDoc.fontSize(8).font('Helvetica').text(_size.volume, 435, x + 5);
                        }
                        pdfDoc.save().moveTo(492, y).lineTo(492, y + 30).stroke(); //right
                        pdfDoc.fontSize(8).font('Helvetica').text(_size.salePrice + ' ' + _size.salePriceCurrency, 502, x + 5);
                        pdfDoc.save().moveTo(535, y).lineTo(535, y + 30).stroke(); //right      
                        pdfDoc.fontSize(8).font('Helvetica-Bold').text(_size.barberSellingPrice + ' ' + _size.barberSellingPriceCurrency, 557, x + 5);
                        pdfDoc.save().moveTo(600, y).lineTo(600, y + 30).stroke(); //
                        pdfDoc.save().moveTo(10, y).lineTo(10, y + 30).stroke(); //left
                        x += 30
                        y += 30
                        line++;
                    }
                }
            }



        });
        pdfDoc.end();






        const to = customerEmail;
        const subject = "Nishman  hesabınız aktive edilmiştir!!!";
        const html = "<div style=\" color:black;\"> <h2> Nishman hesabınız onaylanmıştır </h2><br/> Aşağıda ki linke tıklayarak sisteme giriş yapabilirsiniz. <br/> <br/><a style=\"padding:10px; background-color:orange;margin-top:10px; margin-bottom:10px; text-decoration:none; color:black;  \"  href=\"https://berber.nishman.com.tr/login/\"> Giriş </a><br/> <br/>Nishman Ürünlerinin Alış ve Satış Fiyatlarının olduğu PDF dosyası ektedir. Bilgisayarınıza indirip çıktısını alabilirsiniz.</div> "

        let emailInformation;

        Email.find({ owner: 'noreply' })
            .then(emailSetting => {



                if (emailSetting === []) {

                    const error = new Error('noreply maili bulunamamıştır.');
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
                    },
                    tls: {
                        // do not fail on invalid certs
                        rejectUnauthorized: false
                    }
                });

                const mailOptions = {
                    from: emailSetting[0].userName,
                    to: to,
                    subject: subject,
                    html: html,
                    attachments: [{
                        filename: fileName,
                        path: invoicePath
                    }]
                };


                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        information = error;
                        errorService.sendErrorNotificationViaEmail('individualCustomerController','sendCustomerPricePdf',652,0,err);
      
                    } else {
                        information = info.response;
                        console.log('email sent : ' + information);
                    }


                });



            });



    } catch (err) {
        console.log(err)
        errorService.sendErrorNotificationViaEmail('individualCustomerController','sendCustomerPricePdf',652,0,err);
      
    }

}

const mongodb = require('mongodb');
const Newsletter = require('../models/newsletter');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../utils/file');
const NewsletterMember = require('../models/newsletterMember');
const Barber = require('../models/individualCustomer');
const nodemailer = require('nodemailer');
const Email = require('../models/email');
const ObjectId = mongodb.ObjectId;
const errorService = require('../classes/errorService');
const baseUrl = require('../classes/baseUrl');

exports.getNewsletters = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);





    try {
        const totalNewsletter = await Newsletter.find().countDocuments();
        const newsletters = await Newsletter.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched succesfully',
            newsletters: newsletters,
            totalNewsletter: totalNewsletter
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('newsletterController', 'getNewsletters', 13, 500, err);

        next(err);
    }

}

exports.getNewsletter = (req, res, next) => {
    const newsletterId = req.params.newsletterId


    Newsletter
        .findById(newsletterId)
        .then(newsletter => {

            if (!newsletter) {

                const error = new Error('Could not find product');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'newsletter fetched.', newsletter: newsletter })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('newsletterController', 'getNewsletter', 47, 500, err);

            next(err);

        });

}


exports.postCheckCampaign = (req, res, next) => {


    const price = req.body.price;
    const startMonth = req.body.startMonth;
    const startDay = req.body.startDay;
    const startYear = req.body.startYear;



    startDate = new Date(startYear + "-" + startMonth + "-" + startDay);

    // queryTxt = '{' + customerTxt + statusTxt + '"createdAt": { "\$gt": "' + startDate + '", "\$lt":"' + endDate + '"}}';
    queryTxt = '{' + '"subLimit": {"\$lte":"' + price + '"}' + ',"startDate": { "\$lte": "' + startDate + '"}' + ',"endDate": { "\$gte": "' + startDate + '"}}';



    let query = JSON.parse(queryTxt);


    Newsletter
        .find(query)
        .then(campaign => {

            if (!campaign) {

                const error = new Error('Could not find product');
                err.statusCode = 404;
                throw error;
            }

            res.status(200).json({ message: 'campaign fetched.', campaign: campaign })

        })
        .catch(err => {

            if (!err.statusCode) {

                err.statusCode = 500;
            }
            errorService.sendErrorNotificationViaEmail('newsletterController', 'postCheckCampaign', 80, 500, err);

            next(err);

        });

}


exports.sendNewsletterViaEmail = async (req, res, next) => {
    const newsletterId = req.params.newsletterId

    try {
        const newsletter = await Newsletter.findById(newsletterId);

        if (!newsletter) {

            const error = new Error('Could not find newsletter');
            err.statusCode = 404;
            throw error;
        }

        let mailList = '';

        const newsletterMembers = await NewsletterMember.find();

        for (let m of newsletterMembers) {
            mailList += m.mail + ',';
        }


        const barbers = await Barber.find();

        for (let b of barbers) {
            mailList += b.email + ',';
        }


        sendNewsletterMail(newsletter, mailList)


        res.status(200).json({ message: 'newsletter fetched.', newsletter: newsletter })


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('newsletterController', 'sendNewsletterViaEmail', 129, 500, err);

        next(err);
    }

}


exports.postAddNewsletter = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {

        if (!req.file) {
            console.log(req.file);

            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = req.file.path.replace("\\", "/");
        console.log(imageUrl)


        const startMonth = req.body.startMonth;
        const startDay = req.body.startDay;
        const startYear = req.body.startYear;

        startDate = new Date(startYear + "-" + startMonth + "-" + startDay);

        const endMonth = req.body.endMonth;
        const endDay = req.body.endDay;
        const endYear = req.body.endYear;

        endDate = new Date(endYear + "-" + endMonth + "-" + endDay);


        const newsletter = new Newsletter({
            imageUrl: imageUrl,
            title: req.body.title,
            link: req.body.link,
            description: req.body.description,
            type: req.body.type,
            amount: req.body.amount,
            subLimit: req.body.subLimit,
            limit: req.body.limit,
            code: req.body.code,
            startDate: startDate,
            endDate: endDate

        });
        const result = await newsletter.save();
        res.status(201).json({ statusCode: 201, message: 'newsletter created!', newsletterId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('newsletterController', 'postAddNewsletter', 176, 500, err);

        next(err);
    }
}



exports.putUpdateNewsletter = async (req, res, next) => {
    const newsletterId = req.params.newsletterId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }



    const startMonth = req.body.startMonth;
    const startDay = req.body.startDay;
    const startYear = req.body.startYear;

    startDate = new Date(startYear + "/" + startMonth + "/" + startDay);



    const endMonth = req.body.endMonth;
    const endDay = req.body.endDay;
    const endYear = req.body.endYear;

    endDate = new Date(endYear + "/" + endMonth + "/" + endDay);

    const newNewsletter = new Newsletter({
        title: req.body.title,
        link: req.body.link,
        description: req.body.description,
        imageUrl: req.body.image,
        subLimit: req.body.subLimit,
        limit: req.body.limit,
        type: req.body.type,
        amount: req.body.amount,
        code: req.body.code,
        startDate: startDate,
        endDate: endDate

    });

    try {
        const oldNewsletter = await (await Newsletter.findById(newsletterId));
        if (!oldNewsletter) {
            const error = new Error('Could not find Newsletter.');
            error.statusCode = 404;
            throw error;
        }


        oldNewsletter.title = newNewsletter.title;
        oldNewsletter.description = newNewsletter.description;
        oldNewsletter.imageUrl = newNewsletter.imageUrl;
        oldNewsletter.link = newNewsletter.link;
        oldNewsletter.type = newNewsletter.type;
        oldNewsletter.amount = newNewsletter.amount;
        oldNewsletter.subLimit = newNewsletter.subLimit;
        oldNewsletter.limit = newNewsletter.limit;
        oldNewsletter.code = newNewsletter.code;
        oldNewsletter.startDate = newNewsletter.startDate;
        oldNewsletter.endDate = newNewsletter.endDate;

        const result = await oldNewsletter.save();

        res.status(200).json({ message: 'Product updated!', newsletter: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('newsletterController', 'putUpdateNewsletter', 241, 500, err);

        next(err);
    }
};



exports.deleteNewsletter = async (req, res, next) => {
    const newsletterId = req.params.newsletterId;
    try {
        const newsletter = await Newsletter.findById(newsletterId);

        if (!newsletter) {
            const error = new Error('Could not find newsletter.');
            error.statusCode = 404;
            throw error;
        }


        await Newsletter.findByIdAndRemove(newsletterId);

        res.status(200).json({ message: 'Deleted newsletter.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('newsletterController', 'deleteNewsletter', 317, 500, err);

        next(err);
    }
};


exports.postAddNewsletterMember = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    try {

        const newsletterMember = new NewsletterMember({

            mail: req.body.mail


        });
        const result = await newsletterMember.save();
        res.status(201).json({ statusCode: 201, message: 'newsletter Member created!', newsletterMemberId: result._id });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('newsletterController', 'postAddNewsletterMember', 343, 500, err);

        next(err);
    }
}

exports.getNewsletterMembers = async (req, res, next) => {


    const currentPage = req.query.page || 1;
    const pageSize = req.query.pagesize;
    const perPage = Number(pageSize);





    try {
        const totalNewsletterMember = await NewsletterMember.find().countDocuments();
        const newsletterMembers = await NewsletterMember.find()
            .skip((currentPage - 1) * perPage)
            .sort({ createdAt: -1 })
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched succesfully',
            newsletterMembers: newsletterMembers,
            totalNewsletterMember: totalNewsletterMember
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        errorService.sendErrorNotificationViaEmail('newsletterController', 'getNewsletterMembers', 374, 500, err);

        next(err);
    }

}


sendNewsletterMail = async (newsletter, mails) => {





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
                }
            });


            let newsletterImageUrl = baseUrl.imageApiUrl + newsletter.imageUrl;
            let newsletterLink = ecommerceUrl + "/product/" + newsletter.link;


            subject = newsletter.title;


            let htmlForMail = " <html> <body>" +
                "<div>" +
                "<div> <img src=" + newsletterImageUrl + "></div> <br>" +
                "<div style='text-align:center;'> <h2>" + newsletter.title + "</h2> </div>  <br>" +
                "<div> <p>" + newsletter.description + "</p> </div>  <br> " +
                "<div> <a href=" + newsletterLink + "> Ürüne Git </a> </div>" +
                "</div>" +
                "</body></html>";




            const mailOptions = {
                from: emailSetting[0].userName,
                to: mails,
                subject: subject,
                html: htmlForMail
            };
            let information;

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    information = error;
                    errorService.sendErrorNotificationViaEmail('newsletterController', 'sendNewsletterMail', 410, 500, err);

                } else {
                    information = info.response;
                    console.log('email sent : ' + information);
                }
            });


        });


}
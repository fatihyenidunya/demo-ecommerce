const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const Error = require('../models/error');
const Email = require('../models/email');
const NotificationEmail = require('../models/notificationEmail');

exports.sendErrorNotificationViaEmail = async (controller, _function, line, code, detail) => {


    const error = new Error({
        controller: controller,
        function: _function,
        line: line,
        detail: detail,
        code: code,

    });

    const result = await error.save();

    const errorNotificationMail = await NotificationEmail.find({ whatFor: 'error' });

  

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

      


            let _html = '<div> <h2> Nishman error notification   </h2><br/>  <p> Aşşağıda bilgileri yazan hata çözülmeyi beklemekte.</p> <br/> <table> <tr> <td> Controller </td> <td> ' + controller + ' </td> </tr> <tr> <td> Function : </td> <td> ' + _function + ' </td></tr> <tr> <td> Function Line :  </td> <td> ' + line + ' </td> </tr> <tr> <td> Code : </td> <td> ' + code + ' </td> </tr> <tr> <td> Detail : </td> <td> ' + detail + ' </td> </tr>   </table>  </div>'


            const mailOptions = {
                from: emailSetting[0].userName,
                to: errorNotificationMail[0].email,
                subject: 'Nishman an error is occured',
                html: _html
            };
            let information;

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    information = error;
                } else {
                    information = info.response;
                    console.log('email sent : ' + information);
                }
            });


        });


}
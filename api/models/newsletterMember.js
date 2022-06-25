const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const newsletterMemberSchema = new Schema({


    mail: {
        type: String
    }

}
    , {
        timestamps: true

    });

module.exports = mongoose.model('NewsletterMember', newsletterMemberSchema);


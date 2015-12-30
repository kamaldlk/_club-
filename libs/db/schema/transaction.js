var mongoose = require('mongoose'),
    currency = require('./index.js').currency.currencySchema,
    club = require('./index.js').club.clubSchema,
    manager = require('./index.js').adminUsers.adminUsersSchema,
    member = require('./index.js').customerUsers.customerUsersSchema,
    Schema = mongoose.Schema;

module.exports.transactionSchema = new mongoose.Schema({   
    clubId: {type: Schema.Types.ObjectId, ref: 'club'},
    cardNo: String,
    amount: {
        spent: Number,
        offer: Number,
        saved: Number // USD
    },
    transactionDate: {type: Date, default: Date.now},
    customerDetails: mongoose.Schema.Types.Mixed,
    currency: {type: Schema.Types.ObjectId, ref: 'currency'},
    usedByCardholder: {type: Boolean, default: false},
    reference: {
        by: {type: Schema.Types.ObjectId, ref: 'member'},
        offer: Number,
        offerAmount: Number // USD
    },
    createdOn: {type: Date, default: Date.now},
    createdBy: {type: Schema.Types.ObjectId, ref: 'manager'}   
});
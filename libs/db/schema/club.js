var mongoose = require('mongoose');
var currency = require('./index.js').currency.currencySchema;
var manager = require('./index.js').adminUsers.adminUsersSchema;
var Schema = mongoose.Schema;
module.exports.clubSchema = new mongoose.Schema({   
    clubName: {type: String, required: true},
    netAmount: String,
    currencyDetails: {type: Schema.Types.ObjectId, ref: 'currency'},
    address: mongoose.Schema.Types.Mixed,
    logo: {type: String, required: false},
    createdOn: {type: Date, default: Date.now },
    createdBy: String,
    updatedBy: String,
    updatedOn: String,
    status: {type: Boolean, default: true},
    contactNumber: {type: String, required: true},
    email: String,
    managers: [{type: Schema.Types.ObjectId, ref: 'manager'}]
});
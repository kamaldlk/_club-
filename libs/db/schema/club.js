var mongoose = require('mongoose');
var currency = require('./index.js').currency.currencySchema;
var Schema = mongoose.Schema;

var adminUsers = new mongoose.Schema({
    userName: String,
    password: String,    
    profile: mongoose.Schema.Types.Mixed,
    role: {type: String, default: 'manager'},
    address: mongoose.Schema.Types.Mixed,
    lastLoggedOn: {type: Date, default: Date.now},
    createdOn : {type: Date, default: Date.now},
    createdBy: String,
    updatedBy: String,
    updatedOn: {type: Date, default: Date.now},
    status: {type: Boolean, default: true},
    club: {type: Schema.Types.ObjectId, ref: 'club'},
    members:[{type: Schema.Types.ObjectId, ref: 'customerUsers'}]
});
var adminUsersSchema = mongoose.model('adminUsers', adminUsers, 'adminUsers');

var customerUsers = new mongoose.Schema({
    profile: mongoose.Schema.Types.Mixed,
    mobileNo: String,
    email: {type: String, required: true},
    cardNo: {type: String, required: true},
    netAmount: Number,
    role: {type: String, default: 'member'},
    address: mongoose.Schema.Types.Mixed,
    createdOn: { type: Date, default: Date.now },
    createdBy: {type: Schema.Types.ObjectId, ref: 'adminUsers'},
    updated: {
        by: {type: Schema.Types.ObjectId, ref: 'adminUsers'},
        on: {type: Date, default: Date.now}
    },
    status: {type: Boolean, default: true},
    club: {type: Schema.Types.ObjectId, ref: 'club'}
   
});
var customerUsersSchema = mongoose.model('customerUsers', customerUsers, 'customerUsers');

var club = new mongoose.Schema({   
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
    managers: [{type: Schema.Types.ObjectId, ref: 'adminUsers'}],
    description: String
});

module.exports = {
    adminUsersSchema: adminUsers,
    clubSchema: club,
    customerUsersSchema: customerUsers
}
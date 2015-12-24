var mongoose = require('mongoose');
var currency = require('./index.js').currency;
var Schema = mongoose.Schema;
module.exports.clubSchema = new mongoose.Schema({
   
    clubName:String,
    cardNo:String,
    netAmount:String,
    currencyDetails: {type: Schema.Types.ObjectId, ref: 'currency'},
    address: mongoose.Schema.Types.Mixed,
    createdOn : { type: Date, default: Date.now },
    createdBy: String,
    updatedBy: String,
    updatedOn: String,
    status: {type: Boolean, default: true}
});
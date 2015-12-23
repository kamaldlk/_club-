var mongoose = require('mongoose');

module.exports.clubTransectionSchema = new mongoose.Schema({
   
    clubId:String,
    cardNo:String,
    amount:String,
    transectionDate:String,
    customerDetails: mongoose.Schema.Types.Mixed,
    currencyDetails:mongoose.Schema.Types.Mixed,
    isUsedByCardholder: { type: Boolean, default: false },
    createdOn : { type: Date, default: Date.now },
    createdBy:String,
    updatedBy:String,
    updatedOn:String,
    status: String
   
});
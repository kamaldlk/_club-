var mongoose = require('mongoose');

module.exports.clubSchema = new mongoose.Schema({
   
    clubName:String,
    cardNo:String,
    netAmount:String,
    currencyDetails:mongoose.Schema.Types.Mixed,
    address: { type: Boolean, default: false },
    createdOn : { type: Date, default: Date.now },
    createdBy:String,
    updatedBy:String,
    updatedOn:String,
    status: String
   
});
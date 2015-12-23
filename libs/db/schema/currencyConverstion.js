var mongoose = require('mongoose');

module.exports.currencyConverstionSchema = new mongoose.Schema({
    fromCurrency:mongoose.Schema.Types.Mixed,
    toCurrency:mongoose.Schema.Types.Mixed,
    converstionRate:String,
    createdOn : { type: Date, default: Date.now },
    createdBy:String,
    updatedBy:String,
    updatedOn:String,
    status: String
   
});
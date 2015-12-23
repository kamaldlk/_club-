var mongoose = require('mongoose');

module.exports.currencySchema = new mongoose.Schema({
   
    currency:mongoose.Schema.Types.Mixed,
    createdOn : { type: Date, default: Date.now },
    status: String
   
});
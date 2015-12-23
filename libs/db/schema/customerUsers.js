var mongoose = require('mongoose');

module.exports.customerUsersSchema = new mongoose.Schema({
    profile: mongoose.Schema.Types.Mixed,
    mobileNo:String,
    email:String,
    cardNo:String,
    netAmount:String,
    role:mongoose.Schema.Types.Mixed,
    address: { type: Boolean, default: false },
    createdOn : { type: Date, default: Date.now },
    createdBy:String,
    updatedBy:String,
    updatedOn:String,
    status: String
   
});
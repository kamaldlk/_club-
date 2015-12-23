var mongoose = require('mongoose');

module.exports.adminUsersSchema = new mongoose.Schema({
    userName: String,
    password: String,
    profile: mongoose.Schema.Types.Mixed,
    role:mongoose.Schema.Types.Mixed,
    address: mongoose.Schema.Types.Mixed,
    lastLoggedOn: { type: Date, default: Date.now },
    createdOn : { type: Date, default: Date.now },
    createdBy:String,
    updatedBy:String,
    updatedOn:{ type: Date, default: Date.now },
    status: String
});

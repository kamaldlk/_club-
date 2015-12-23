var mongoose = require('mongoose');

module.exports.clubCardOfferSchema = new mongoose.Schema({
   
    clubId:String,
    cardHolderOffer:String,
	cardReferredOffer:String,
    createdOn : { type: Date, default: Date.now },
    createdBy:String,
    updatedBy:String,
    updatedOn:String,
    status: String
   
});
var mongoose = require('mongoose');

module.exports.currencyConverstionSchema = new mongoose.Schema({
	fromCurrency: {
		code: {type: String},
		value: {type: Number, default: 1},
	},
	toCurrency: [{
		code: {type: String, default: 'USD'},
		value: {type: String},
		date: {type: Date, default: Date.now}
	}],
    createdOn: {type: Date, default: Date.now},
    createdBy: {type: String, default: 'admin'},
    updatedBy: {type: String, default: 'admin'},
    updatedOn: {type: Date, default: Date.now},
    status: {type: Boolean, default: true}
});
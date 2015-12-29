var mongoose = require('mongoose');

module.exports.offerSchema = new mongoose.Schema({   
     newCustomer: [{
     	'percentage': Number,
     	'date': {type: Date, default: Date.now}
     }],
     referralCustomer: [{
     	'percentage': Number,
     	'date': {type: Date, default: Date.now}
     }]
});
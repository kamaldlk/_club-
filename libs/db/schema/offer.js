var mongoose = require('mongoose');

module.exports.offerSchema = new mongoose.Schema({   
    holderUse: [{
     	'percentage': Number,
     	'date': {type: Date, default: Date.now}
    }],
    holderReference: [{
     	'percentage': Number,
     	'date': {type: Date, default: Date.now}
    }],
    customer: [{
     	'percentage': Number,
     	'date': {type: Date, default: Date.now}
    }]
});
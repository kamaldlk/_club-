var mongoose = require('mongoose');

module.exports.offerSchema = new mongoose.Schema({   
    usedByHolder: [{
     	'percentage': Number,
     	'date': {type: Date, default: Date.now}
    }],
    toReference: [{
     	'percentage': Number,
     	'date': {type: Date, default: Date.now}
    }],
    toUser: [{
     	'percentage': Number,
     	'date': {type: Date, default: Date.now}
    }]
});
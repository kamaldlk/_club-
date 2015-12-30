if(!GLOBAL.portal.mongoose)
{
    GLOBAL.portal.mongoose = require('mongoose');
    GLOBAL.portal.mongoose.connect('mongodb://localhost/clubManagement');
}

    
    GLOBAL.portal.mongoose.connection.on('connected', function () {  
        console.log('Mongoose default connection opened');
    }); 
    
    GLOBAL.portal.mongoose.connection.on('error',function (err) {  
        console.log('Mongoose default connection error: ' + err);
    }); 
    
    GLOBAL.portal.mongoose.connection.on('disconnected', function () {  
        console.log('Mongoose default connection disconnected'); 
    });

module.exports.currency = GLOBAL.portal.mongoose.model("currency", require("./currency.js").currencySchema, "currency");
module.exports.adminUsers = GLOBAL.portal.mongoose.model("adminUsers", require("./club.js").adminUsersSchema, "adminUsers");
module.exports.customerUsers = GLOBAL.portal.mongoose.model("customerUsers", require("./club.js").customerUsersSchema, "customerUsers");
module.exports.club = GLOBAL.portal.mongoose.model("club", require("./club.js").clubSchema, "club");
module.exports.clubTransection = GLOBAL.portal.mongoose.model("clubTransection", require("./clubTransection.js").clubTransectionSchema, "clubTransection");
module.exports.currencyConversion = GLOBAL.portal.mongoose.model("currencyConversion", require("./currencyConversion.js").currencyConverstionSchema, "currencyConversion");
module.exports.offer = GLOBAL.portal.mongoose.model("offer", require("./offer.js").offerSchema, "offer");

var express = require('express');
var router = express.Router();
require("./adminUsers.js")(router);
require("./customerUsers.js")(router);
require("./currency.js")(router);
require("./club.js")(router);
require("./currencyConversion.js")(router);
require("./offer.js")(router);
module.exports = router;
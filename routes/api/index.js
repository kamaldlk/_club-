var express = require('express');
var router = express.Router();
require("./adminUsers.js")(router);
require("./customerUsers.js")(router);
module.exports = router;
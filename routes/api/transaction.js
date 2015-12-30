var db = require("../../libs/db/index.js");
var _ = require("underscore")._;
var uuid = require('node-uuid');
var _constants = require("../../libs/constants/constants.js");

module.exports = function(router) {
    // create transaction
    router.post('/transaction/create', function (req, res) {     
        var data = {
            clubId: req.body.clubId,
            cardNo: req.body.cardNo,
            amount: {
                spent: req.body.spentAmount
            },
            currency: req.body.currency,
            currencyCode: req.body.code,
            usedByCardholder: req.body.usedByCardholder,
            createdBy: req.body.createdBy
        }
        if(!data.usedByCardholder) {
            if(!req.body.referredBy || !req.body.customerDetails)
                res.json({
                    error: true,
                    errorCode: 'Need reference details'
                });
            else {
                data.customerDetails = req.body.customerDetails;
                data.reference = {
                    by: req.body.referredBy
                }
                create();
            }
        }
        else
            create();
        function create() {
            db.transaction.create(data, function(data) {
                res.send(data);
            });
        }
    });
};
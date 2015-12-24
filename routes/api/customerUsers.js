var db = require("../../libs/db/index.js");
var _ = require("underscore")._;
var uuid = require('node-uuid');
var _constants = require("../../libs/constants/constants.js");


module.exports = function(router) {
    router.post("/customerUsers/register", function(req, res) // register a new user
        {
        
         {
        
            var data = {
               "userName": req.body.userName
                
            }
        
            db.customerUsers.register(data, function(data) {
                res.json(data);
            });
        }); 
        
           
        });
};
var db = require("../../libs/db/index.js");
var _ = require("underscore")._;
var uuid = require('node-uuid');
var _constants = require("../../libs/constants/constants.js");


module.exports = function(router) {
    router.post("/adminUsers/register", function(req, res) // register a new user
        {
        
            var data = {
               userName: req.body.userName,
               password:req.body.password,
               profile:req.body.profile,
               role:req.body.role,
               address:req.body.address,
               createdBy:req.body.createdBy,
               updatedBy:req.body.updatedBy,
               status:req.body.status    
            }

            db.adminUsers.register(data, function(data) {
                res.json(data);
            });
        }); 

     router.post("/adminUsers/login", function(req, res) // register a new user
        {
        
        var username = req.body.username;
        var password = req.body.password;
        var role = req.body.role;
         
          if (!username || !password || !role) {
            res.json(
            {
                error: true,
                errorCode: "field missing" 
            });
            return;
        }
         
            var data = {
               userName: username,
               password: password,
               role:role
            }
        
            db.adminUsers.login(data, function(data) {
                res.json(data);
            });
        });


};
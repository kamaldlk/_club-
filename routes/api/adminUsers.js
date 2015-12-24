var db = require("../../libs/db/index.js"),
    schema = require("../../libs/db/schema/index.js"),
    _ = require("underscore")._,
    uuid = require('node-uuid'),
    _constants = require("../../libs/constants/constants.js"),
    bcrypt = require('bcrypt'),    
    salt = bcrypt.genSaltSync(10);


module.exports = function(router) {
    router.post("/adminUsers/register", function(req, res) {// register a new user   
        var hash = bcrypt.hashSync(req.body.password, salt);     
        var data = {
            userName: req.body.userName,
            password: hash,
            profile: req.body.profile,               
            address: req.body.address,
            createdBy: req.body.createdBy
        }
        if(req.body.role && req.body.role === 'admin') {
            schema.adminUsers.findOne({role: 'admin'}, function(err, admin) {
                if(err) {
                    res.json({
                        error: true,
                        errorCode: 'UNKNOWN_ERROR',
                        stack: err
                    })
                }
                else if(admin) {
                    res.json({
                        error: true,
                        errorCode: 'ADMIN_EXISTS'
                    })
                }
                else if(!admin) {
                    data.role = req.body.role;
                    db.adminUsers.register(data, function(data) {
                        res.json(data);
                    });
                }
            });
        }
        else if(!req.body.role) {
            db.adminUsers.register(data, function(data) {
                res.json(data);
            });
        }
    }); 

    router.post("/adminUsers/login", function(req, res) { // register a new user        
        console.log('login ');
        var username = req.body.userName;
        var password = req.body.password;

        if (!username || !password ) {
            res.json({
                error: true,
                errorCode: "field missing" 
            });
        }
        else {            
            var data = {
                userName: username,
                password: password
            }

            db.adminUsers.login(data, function(data) {
                res.json(data);
            });
        }
    });


};
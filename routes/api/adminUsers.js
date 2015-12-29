var db = require("../../libs/db/index.js"),
    schema = require("../../libs/db/schema/index.js"),
    _ = require("underscore")._,
    uuid = require('node-uuid'),
    _constants = require("../../libs/constants/constants.js"),
    bcrypt = require('bcrypt'),    
    salt = bcrypt.genSaltSync(10);


module.exports = function(router) {
    // register a new manager   
    router.post("/adminUsers/register", function(req, res) {
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
            if(!req.body.club) 
                res.json({
                    error: true,
                    errorCode: 'Club name not given'
                });
            else {
                data.club = req.body.club;            
                db.adminUsers.register(data, function(data) {
                    res.json(data);
                });
            }
        }
    }); 
    
    // manager login
    router.post("/adminUsers/login", function(req, res) { 
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

    // manager edit
    router.put('/adminUsers/edit', function (req, res) {
        if(req.body.userName)
            res.send({
                error: true,
                errorCode: 'Username cannot change'
            });
        else {            
            var data = {
                userName: req.query.userName            
            }
            if(req.body.password) {
                var hash = bcrypt.hashSync(req.body.password, salt);
                data.password = hash;
            }
            if(req.body.profile) {
                data.profile = req.body.profile;
            }
            if(req.body.address) 
                data.address = req.body.address;
            if(req.body.club) {
                schema.club.findOne({'clubName': req.body.club}, function (err, club) {
                    if(err) {
                        res.send({
                            error: true,
                            errorCode: 'UNKNOWN_ERROR',
                            stack: err
                        });
                    }
                    else if(!club) {
                        res.send({
                            error: true,
                            errorCode: 'No club'
                        });
                    }
                    else if(club) {
                        console.log('club given ', club);
                        if(club.managers && club.managers.length >= 1) {
                            res.send({
                                error: true,
                                errorCode: 'Manager Exists'
                            });
                        }
                        else {
                            data.club = req.body.club;
                            edit();
                        }
                    }
                });
            }
            else
                edit();

            function edit () {
                db.adminUsers.edit(data, function (data) {
                    res.json(data);
                });
            }
        }
    });

    // get manager
    router.get('/adminUsers/get', function (req, res) {
        var data =  {
            userName: req.query.userName
        }
        db.adminUsers.get(data, function (data) {
            res.send(data);
        });
    });

    // get all managers
    router.get('/adminUsers/getAll', function (req, res) {
        var data =  {};
        db.adminUsers.getAll(data, function (data) {
            res.send(data);
        });
    });

    // remove manager
    router.delete('/adminUsers/remove', function (req, res) {
        var data =  {
            userName: req.query.userName
        }
        db.adminUsers.remove(data, function (data) {
            res.send(data);
        });
    });
    
};
var db = require("./schema/index.js"),
    _constants = require("../constants/constants.js"),
    uuid = require('node-uuid'),
    _ = require("underscore")._,
    bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = {
    register: function(data, callback) {
        db.adminUsers.findOne({userName: data.userName}, function(err, user) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if (user) {
                callback({
                    error: true,
                    errorCode: "Duplicate member"
                });
            } 
            else {
                var adminUsers = new db.adminUsers(data);
                if(data.club) {
                    db.club.findOne({'clubName': data.club}, function (err, club) {
                        if(err) {
                            callback({
                                error: true,
                                errorCode: 'UNKNOWN_ERROR',
                                stack: err
                            });
                        }
                        else if(!club) {
                            callback({
                                error: true,
                                errorCode: 'No club '
                            });
                        }
                        else if(club) {
                            if(club.managers && club.managers.length >= 1)
                                callback ({
                                    error: true,
                                    errorCode: 'Manager already exists'
                                })
                            else {                                
                                adminUsers.club = club._id;
                                adminUsers.save(function(err, savedUser){
                                    savedUser = savedUser.toObject();
                                    delete savedUser.password;
                                    club.managers.push(savedUser._id);
                                    club.save();
                                    callback(savedUser);
                                });
                            }
                        }
                    });
                }
                else {
                    adminUsers.save(function(err, savedUser){
                        savedUser = savedUser.toObject();
                        delete savedUser.password;
                        callback(savedUser);
                    });
                } 
            }
        });
    }, 

    login: function(data, callback) {    
        db.adminUsers.findOne({userName: data.userName}).populate('club') .exec(function(err, user) { 
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if (user) {
                if(bcrypt.compareSync(data.password, user.password)) {
                    user = user.toObject();
                    delete user.password;
                    db.currency.findOne({'_id': user.club.currencyDetails}, function (err, currency) {
                        user.club.currencyDetails = currency;
                        callback(user);
                    });
                }
                else{
                    callback({
                        error: true,
                        errorCode: "_constants.ERRORS.INVALID_CREDS"
                    });       
                }        
            }
            else if(!user) {
                callback({
                    error: true,
                    errorCode: 'NOT_EXISTS'
                });
            }
       });  
    },

    // update manager details
    edit: function (data, callback) {
        var clubName;
        if(data.club) {
            clubName = data.club;            
            delete data.club;
        }
        data.updatedOn = Date.now();
        db.adminUsers.findOneAndUpdate({userName: data.userName}, {$set: data}, {new: true}, function (err, manager) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!manager) {
                callback({
                    error: true,
                    errorCode: 'No manager'
                });
            }
            else if(manager) {
                if(clubName) {
                    db.club.findOneAndUpdate({'clubName': clubName}, {$push: {'managers': manager._id}}, function (err, updated) {
                        if(updated) {
                            db.club.update({'_id': manager.club}, {$pop: {'managers': 1}}, function (err, removedManager) {
                                if(removedManager)
                                    manager.club = updated._id;
                                    manager.save();
                                    callback({
                                        success: true,
                                        message: 'Updated'
                                    });
                            });
                        }
                        else {
                            callback({
                                error: true,
                                errorCode: 'Not updated'
                            });
                        }
                    });
                }
                else
                    callback({
                        success: true,
                        message: 'Updated'
                    });
            }
        });
    },

    // get single manager
    get: function (data, callback) {
        db.adminUsers.findOne({'userName': data.userName}, '-password').populate('club').exec(function (err, manager) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!manager) {
                callback({
                    error: true,
                    errorCode: 'No manager'
                });
            }
            else if(manager) {
                callback(manager);
            }
        });
    },

    // get all managers
    getAll: function (data, callback) {
        db.adminUsers.find({'role': 'manager'}, '-password').populate('club').exec(function (err, managers) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!managers || managers.length < 1) {
                callback({
                    error: true,
                    errorCode: 'No manager'
                });
            }
            else {
                callback(managers);
            }
        });
    },

    // remove manager
    remove: function (data, callback) {
        db.adminUsers.findOne({'userName': data.userName}, function (err, manager) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!manager) {
                callback({
                    error: true,
                    errorCode: 'No manager'
                });
            }
            else if(manager) {
                db.club.update({'_id': manager.club}, {$pop: {'managers': 1}}, function (err, removedManager) {
                    if(removedManager) {                        
                        db.adminUsers.remove({'userName': data.userName}, function (err, deleted) {
                            if(deleted) {                                
                                callback({
                                    success: true,
                                    message: 'Manager deleted'
                                });
                            }
                            else {
                                callback({
                                    error: true,
                                    errorCode: 'Not deleted'
                                })
                            }
                        });
                    }
                    else {
                        callback({
                            error: true,
                            errorCode: 'Not deleted'
                        })
                    }
                });
            }
        });
    }
};
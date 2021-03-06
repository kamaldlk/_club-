var db = require("./schema/index.js");
var _constants = require("../constants/constants.js");
var uuid = require('node-uuid');
var _ = require("underscore")._;

module.exports = {
    // create member
    register: function (data, callback) {
        db.customerUsers.findOne({$or: [{'cardNo': data.cardNo}, {'email': data.email}]}, function (err, exists) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(exists) {
                callback({
                    error: true,
                    errorCode: 'Duplicate member / card'
                });
            }
            else if(!exists) {
                var type = data.type;
                var customer = new db.customerUsers(data);
                customer.save(function(err, user) {
                    console.log(data.createdBy, user);
                    if(err) {
                        console.log(err);
                        callback({
                            error: true,
                            errorCode: 'UNKNOWN_ERROR',
                            stack: err
                        });
                    }
                    else if(!user) {
                        callback({
                            error: true,
                            errorCode: 'Not able to create'
                        });
                    }
                    else if(user) {
                        db.adminUsers.update({'_id': data.createdBy}, {$push:{'members': user._id}}, function (err, updated) {
                            if(err) {
                                console.log(err);
                                callback({
                                    error: true,
                                    errorCode: 'UNKNOWN_ERROR',
                                    stack: err
                                });
                            }
                            else
                                callback(user);                            
                        });
                    }
                });
            }
        });
    },

    // get single member detail
    get: function (data, callback) {
        db.customerUsers.findOne({'email': data.email}).populate([{path: 'club', select: 'clubName address contactNumber logo'}, {path: 'createdBy', select: 'userName profile address role'}]).exec(function(err, member) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!member) {
                callback({
                    error: true,
                    errorCode: 'No member'
                });
            }
            else if(member) {
                callback(member)
            }
        });
    },

    // get all customers
    getAll: function (data, callback) {
        db.customerUsers.find({}).populate([{path: 'club', select: 'clubName address contactNumber logo'}, {path: 'createdBy', select: 'userName profile address role'}]).exec(function(err, member) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!member || member.length < 1) {
                callback({
                    error: true,
                    errorCode: 'No member'
                });
            }
            else {
                callback(member)
            }
        });
    },

    // get club member detail
    getByClub: function (data, callback) {
        db.customerUsers.find({'club': data.club}).populate([{path: 'club', select: 'clubName address contactNumber logo'}, {path: 'createdBy', select: 'userName profile address role'}]).exec(function(err, member) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!member || member.length < 1) {
                callback({
                    error: true,
                    errorCode: 'No member'
                });
            }
            else {
                callback(member)
            }
        });
    },

    // get club member detail
    getByManager: function (data, callback) {
        db.customerUsers.find({'createdBy': data.manager}).populate([{path: 'club', select: 'clubName address contactNumber logo'}, {path: 'createdBy', select: 'userName profile address role'}]).exec(function(err, member) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!member || member.length < 1) {
                callback({
                    error: true,
                    errorCode: 'No member'
                });
            }
            else {
                callback(member)
            }
        });
    }
};
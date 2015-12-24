var db = require("./schema/index.js");
var _constants = require("../constants/constants.js");
var uuid = require('node-uuid');
var _ = require("underscore")._;

module.exports = {

        register: function(data, callback) {
        db.customerUsers.findOne({
            userName: data.userName
        }, function(err, user) {
            if (user) {

                callback({
                    error: true,
                    errorCode: "jasdgjh"
                })

            } else {
                var adminUsers = new db.customerUsers(data);
                customerUsers.save(function(savedUser){
                   callback(savedUser);
                });

            }
        });
    }
};
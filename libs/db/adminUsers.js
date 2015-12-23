var db = require("./schema/index.js");
var _constants = require("../constants/constants.js");
var uuid = require('node-uuid');
var _ = require("underscore")._;

module.exports = {

    register: function(data, callback) {
        console.log("Data ::", data);
        db.adminUsers.findOne({
            userName: data.userName
        }, function(err, user) {
            if (user) {

                callback({
                    error: true,
                    errorCode: "jasdgjh"
                })

            } else {
                var adminUsers = new db.adminUsers(data);
                adminUsers.save(function(savedUser){
                   callback(savedUser);
                });

            }
        });
    }
};
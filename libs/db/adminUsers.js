var db = require("./schema/index.js"),
    _constants = require("../constants/constants.js"),
    uuid = require('node-uuid'),
    _ = require("underscore")._,
    bcrypt = require('bcrypt');

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
                // if(data.club) {
                //     db.club.findOne({'clubName': data.club}, function (err, club) {
                //         if(err) {
                //             callback({
                //                 error: true,
                //                 errorCode: 'UNKNOWN_ERROR',
                //                 stack: err
                //             });
                //         }
                //         else if(!club) {
                //             callback({
                //                 error: true,
                //                 errorCode: 'NO_CLUB'
                //             });
                //         }
                //         else if(club) {
                            
                //         }
                //     });
                // }
                adminUsers.save(function(err, savedUser){
                    savedUser = savedUser.toObject();
                    delete savedUser.password;
                    callback(savedUser);
                });
            }
        });
    }, 

    login: function(data, callback) {    
        db.adminUsers.findOne({userName: data.userName}, '-_id', function(err, user) {        
            if (user) {
                if(bcrypt.compareSync(data.password, user.password)) {                    
                    console.log('user ', user);
                    user = user.toObject();
                    delete user.password;
                    callback(user);
                }
                else{
                    callback({
                        error: true,
                        errorCode: "_constants.ERRORS.INVALID_CREDS"
                    });       
                }        
            }
            else {
                callback({
                    error: true,
                    errorCode: 'NOT_EXISTS'
                })
            }
       });  
    } 
};
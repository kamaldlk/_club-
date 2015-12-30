/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 09/10/15
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.providers')

    .provider ('api', function apiProvider () {

        var _apiUrl = null;
        this.setApiUrl = function ( url ) {
            _apiUrl = url;

        };

        var _apiHeaders = null;


        var http = null;
        var httpRequest = function ( method, path, data, callback ) {
            if ( http == null ) callback ({
                error: true,
                errorCode: "HTTP_NULL"
            }, null);
            _apiHeaders = "headers: {'Content-Type': application/json}";
            http ({
                method: method,
                url: _apiUrl + path,
                headers: _apiHeaders,
                data: data
            })
                .success (function ( data, status, headers, config ) {
                    if ( data.error ) {
                        callback (data, null);
                    } else {
                        callback (null, data);
                    }
                })
                .error (function ( data, status, headers, config ) {
                    callback ({
                        error: true,
                        errorCode: "UNKNOWN_ERROR"
                    }, null);
                });
        };

        var rootScope = null;


        this.$get = ['$injector', '$http', function ( $injector, $http ) {
            rootScope = $injector.get ('$rootScope');
            http = $http;
            var apiClass = {};

            {
                apiClass.User = function () {
                    this.id = "";
                    this.userName = "";
                    this.profile = {};
                    this.role = "";
                    this.address = {};
                    this.createdBy = "";
                    this.updatedBy = "";
                    this.updatedOn = "";
                    this.status = "";

                    this.update = function ( callback ) {
                        httpRequest ("PUT", "user/user/" + this.id, null, this, null, function ( err, data ) {
                            callback (err, data);
                        });
                    };

                }

                apiClass.User.signIn = function ( user, callback ) {
                    httpRequest ("POST", "api/adminUsers/login", user, function ( err, data ) {
                        if ( err ) {
                            console.log ('error in signin ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            callback (null, data);
                        }
                    });
                }

                Object.defineProperty (apiClass.User, 'currentUser', {
                    set: function ( value ) {
                        settings.user = value;
                    },
                    get: function () {
                        return settings.user
                    }
                });
            }
            {
                apiClass.Currency = function () {


                }

                apiClass.Currency.allCountries = [];
                apiClass.Currency.currencyArray = [];

                apiClass.Currency.getAll = function ( callback ) {
                    httpRequest ("GET", "api/currency/getAll", null, function ( err, data ) {
                        if ( err ) {
                            console.log ('error in signin ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            apiClass.Currency.allCountries = data;
                            callback (null, data);

                        }
                    });
                }

                apiClass.Currency.getDetails = function ( callback ) {
                    httpRequest ("GET", "api/currencyConversion/get", null, function ( err, data ) {
                        if ( err ) {
                            console.log ('error in signin ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            apiClass.Currency.currencyArray = data;
                            callback (null, data);

                        }
                    });
                }

                apiClass.Currency.update = function ( currency, callback ) {

                    httpRequest ("POST", "api/currencyConversion/update", currency , function ( err, data ) {
                        if ( err ) {
                            console.log ('error in signin ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            callback (null, data);
                        }
                    });


                }


            }

            {

                apiClass.Club = function () {
                    this.id = "";
                    this.clubName = "";
                    this.netAmount = "";
                    this.contactNumber = "";
                    this.address = {};
                    this.currencyDetails = {};
                    this.createdBy = "";
                    this.updatedBy = "";
                    this.updatedOn = "";
                    this.status = "";

                }
                apiClass.Club.allClub = [];

                apiClass.Club.getAllClub = function ( callback ) {
                    httpRequest ("GET", "api/club/getAll", null, function ( err, data ) {
                        if ( err ) {
                            console.log ('error in signin ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            apiClass.Club.allClub = data;
                            callback (null, data);

                        }
                    });

                }

                apiClass.Club.createClub = function ( club, callback ) {

                    httpRequest ("POST", "api/club/create", club, function ( err, data ) {
                        if ( err ) {
                            console.log ('error in signin ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            apiClass.Club.allClub.push (data);
                            callback (null, data);
                        }
                    });


                }

                apiClass.Club.updateClub = function ( club, callback ) {

                    httpRequest ("PUT", "api/club/edit?clubName=" + club.clubName, club, function ( err, data ) {
                        if ( err ) {
                            console.log ('error in signin ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            callback (null, data);
                        }
                    });


                }
                apiClass.Club.removeClub = function ( club, callback ) {

                    var clubName = club.clubName;

                    httpRequest ("DELETE", "api/club/delete?clubName=" + clubName, null, function ( err, data ) {
                        if ( err ) {
                            console.log ('error in signin ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            apiClass.Club.allClub.splice (_.indexOf (apiClass.Club.allClub, {
                                clubName: clubName
                            }), 1);
                            callback (null, data);
                        }
                    });


                }


            }

            {

                apiClass.Manager = function () {}

                apiClass.Manager.managers = [];

                apiClass.Manager.getAllManager = function ( callback ) {
                    httpRequest ("GET", "api/adminUsers/getAll", null, function ( err, data ) {
                        if ( err ) {
                            console.log ('error in signin ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            apiClass.Manager.managers = data;
                            callback (null, data);

                        }
                    });

                }

                apiClass.Manager.createManager = function ( manager, callback ) {

                    httpRequest ("POST", "api/adminUsers/register", manager, function ( err, data ) {
                        if ( err ) {
                            console.log ('error Creating Manager ', err)
                            callback (err, null);
                        } else {
                            console.log ('Manager Created', data)
                            apiClass.Manager.managers.push (data);
                            callback (null, data);
                        }
                    });


                }

                apiClass.Manager.updateManager = function ( manager, callback ) {


                    httpRequest ("PUT", "api/adminUsers/edit?userName=" + manager.userName, manager, function ( err, data ) {
                        if ( err ) {
                            console.log ('error in signin ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            callback (null, data);
                        }
                    });


                }
                apiClass.Manager.removeManager = function ( manager, callback ) {

                    var managerUserName = manager.userName;

                    httpRequest ("DELETE", "api/adminUsers/remove?userName=" + managerUserName, null, function ( err, data ) {
                        if ( err ) {
                            console.log ('unable to remove manager ', err)
                            callback (err, null);
                        } else {
                            console.log ('signin success ', data)
                            apiClass.Manager.managers.splice (_.indexOf (apiClass.Manager.managers, {
                                userName: managerUserName
                            }), 1);
                            callback (null, data);
                        }
                    });


                }

            }
            {
                apiClass.Offer = function () {}

                apiClass.Offer.Get = function ( callback ) {


                    httpRequest ("GET", "api/offer/get", null, function ( err, data ) {
                        if ( err ) {
                            console.log ('offer get error ', err)
                            callback (err, null);
                        } else {
                            console.log ('retriev success ', data)
                            callback (null, data);
                        }
                    });


                }

                apiClass.Offer.Update = function ( offer, callback ) {


                    httpRequest ("POST", "api/offer/update", offer, function ( err, data ) {
                        if ( err ) {
                            console.log ('offer Updated ', err)
                            callback (err, null);
                        } else {
                            console.log ('Updated Successfully ', data)
                            callback (null, data);
                        }
                    });


                }


            }


            return apiClass;
        }];
    });
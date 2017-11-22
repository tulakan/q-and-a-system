const Joi = require('joi');
const mongoose = require('mongoose');

exports.register = function (server, options, next) {

    const UserModel = require('../models/user');

    // list All Account
    server.route({
        method: 'GET',
        path: '/user/listUser',
        config: {
            tags: ['api'],
            description: 'Get All User data',
            notes: 'Get All User data'
        },
        handler: function (request, reply) {
            UserModel.find({}, function (error, data) {
                if (error) {
                    reply({
                        statusCode: 503,
                        message: 'Failed to get data',
                        data: error
                    });
                } else {
                    reply({
                        statusCode: 200,
                        message: 'User Data Successfully Fetched',
                        data: data
                    });
                }
            });
        }
    });

    //get user by username
    server.route({
        method: 'GET',
        path: '/user/getUserbyUsername/{userName}',
        config: {
            // Include this API in swagger documentation
            tags: ['api'],
            description: 'Get User Data by Username',
            notes: 'Get All User data',
            validate: {
                // Id is required field
                params: {
                    userName: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {
            //find username in user collection
            UserModel.findOne({ 'userName': { '$regex': request.params.userName } }, function (error, data) {
                if (error) {
                    reply({
                        statusCode: 503,
                        message: 'Failed to get data',
                        data: error
                    });
                } else {
                    if (data.length === 0) {
                        reply({
                            statusCode: 200,
                            message: 'User Not Found',
                            data: data
                        });
                    } else {
                        reply({
                            statusCode: 200,
                            message: 'User Data Successfully Fetched',
                            data: data
                        });
                    }
                }
            });
        }
    });

    //get User by Device ID
    server.route({
        method: 'GET',
        path: '/user/getUserbyDeviceID/{deviceID}',
        config: {
            // Include this API in swagger documentation
            tags: ['api'],
            description: 'Get User Data by DeviceID',
            notes: 'Get User Data by DeviceID',
            validate: {
                // Id is required field
                params: {
                    deviceID: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {
            //search for equipmentNo in user collection
            UserModel.find({ 'deviceUUID': { '$regex': request.params.deviceID } }, function (error, data) {
                if (error) {
                    reply({
                        statusCode: 503,
                        message: 'Failed to get data',
                        data: error
                    });
                } else {
                    if (data.length === 0) {
                        reply({
                            statusCode: 200,
                            message: 'User Not Found',
                            data: data
                        });
                    } else {
                        reply({
                            statusCode: 200,
                            message: 'User Data Successfully Fetched',
                            data: data
                        });
                    }
                }
            });
        }
    });

    //add user
    server.route({
        method: 'POST',
        path: '/user/addUser',
        config: {
            // "tags" enable swagger to document API
            tags: ['api'],
            description: 'Save user data',
            notes: 'Save user data',
            //use Joi plugin to validate request
            validate: {
                payload: {
                    userName: Joi.string().required(),
                    password: Joi.string().required(),
                    namePrefix: Joi.string().required(),
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required(),
                    accountType: Joi.string().required(),
                    parentStudentName: [Joi.string().optional(), Joi.allow(null)], // for parent
                    deviceUUID: [Joi.string().optional(), Joi.allow(null)], //for student
                }
            }
        },
        handler: function (request, reply) {

            // Create mongodb user object to save it into database
            UserModel.find({ 'userName': { '$regex': request.payload.userName } }, function (error, data) {
                console.log('data --> ', data)
                // if (data != undefined) {
                if (data.length === 0) { //not found user name
                    const user = new UserModel(request.payload);
                    user.save(function (error) {
                        if (error) {
                            reply({
                                status: false,
                                statusCode: 503,
                                message: error
                            });
                        } else {
                            reply({
                                status: true,
                                statusCode: 200,
                                message: 'User Saved Successfully'
                            });
                        }
                    });

                } else {
                    reply({
                        statusCode: 503,
                        message: 'dumplicate Username',
                        data: data
                    });
                }
                // } else {
                //     const user = new UserModel(request.payload);
                //     user.save(function (error) {
                //         if (error) {
                //             reply({
                //                 status: false,
                //                 statusCode: 503,
                //                 message: error
                //             });
                //         } else {
                //             reply({
                //                 status: true,
                //                 statusCode: 200,
                //                 message: 'User Saved Successfully'
                //             });
                //         }
                //     });
                // }

            });
        }
    });

    //updata user
    server.route({
        method: 'POST',
        path: '/user/updateUser',
        config: {
            // Swagger documentation fields tags, description, note
            tags: ['api'],
            description: 'Update specific user data',
            notes: 'Update specific user data',

            // Joi api validation
            validate: {
                // params: {
                //     //`id` is required field and can only accept string data
                // },
                payload: {
                    userName: Joi.string().required(),
                    password: Joi.string().required(),
                    namePrefix: Joi.string().required(),
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required(),
                    accountType: Joi.string().required(),
                    parentStudentName: [Joi.string().optional(), Joi.allow(null)], // for parent
                    deviceUUID: [Joi.string().optional(), Joi.allow(null)], //for student
                }
            }
        },
        handler: function (request, reply) {

            // `findOneAndUpdate` is a mongoose modal methods to update a particular record.
            UserModel.findOneAndUpdate({ userName: request.payload.userName }, request.payload, function (error, data) {
                if (error) {
                    reply({
                        statusCode: 503,
                        message: 'Failed to get data',
                        data: error
                    });
                } else {
                    reply({
                        statusCode: 200,
                        message: 'User Updated Successfully',
                        data: data
                    });
                }
            });

        }
    });

    //delete user
    server.route({
        method: 'DELETE',
        path: '/user/deleteUser/{username}',
        config: {
            tags: ['api'],
            description: 'Remove specific user data',
            notes: 'Remove specific user data',
            validate: {
                params: {
                    username: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            // `findOneAndRemove` is a mongoose methods to remove a particular record into database.
            UserModel.findOneAndRemove({ username: request.params.username }, function (error) {
                if (error) {
                    reply({
                        statusCode: 503,
                        message: 'Error in removing User',
                        data: error
                    });
                } else {
                    reply({
                        statusCode: 200,
                        message: 'User Deleted Successfully'
                    });
                }
            });

        }
    });

    //signin
    server.route({
        method: 'POST',
        path: '/user/signin',
        config: {
            // Include this API in swagger documentation
            tags: ['api'],
            description: 'signin by Username and Password',
            notes: 'Get All User data',
            validate: {
                payload: {
                    username: Joi.string().required(),
                    password: Joi.string().required(),
                }
            }
        },
        handler: function (request, reply) {
            //find username in user collection
            UserModel.find({
                'userName': {
                    '$regex': request.payload.username
                },
                'password': {
                    '$regex': request.payload.password
                }
            }, function (error, data) {
                if (error) {
                    reply({
                        statusCode: 503,
                        message: 'Failed to get data',
                        data: error
                    });
                } else {
                    if (data.length === 0) {
                        reply({
                            statusCode: 404,
                            message: 'User Not Found',
                            // data: data
                        });
                    } else {
                        reply({
                            statusCode: 200,
                            message: 'signin User Successfully Fetched',
                            data: data[0]
                        });
                    }
                }
            });
        }
    });

    return next();
};



exports.register.attributes = {
    name: 'routes-user'
};
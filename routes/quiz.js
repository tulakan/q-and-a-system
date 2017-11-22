/**
 * Created by Kanrawee Karaboot on 4/3/2017.
 */
const Joi = require('joi');
const mongoose = require('mongoose');

exports.register = function (server, options, next) {

    const quizModel = require('../models/quizModel');
    //test
    server.route({
        method: 'GET',
        path: '/quiz/test',
        config: {
            // Include this API in swagger documentation
            tags: ['api'],
            description: 'test',
            notes: 'test'
        },
        handler: function (request, reply) {
            reply({
                status : true,
                statusCode: 200,
                message: 'Quiz API Works'
            });
        }
    });

    // list quiz
    server.route({
        method: 'GET',
        path: '/quiz/listAll',
        config: {
            tags: ['api'],
            description: 'List All Quiz',
            notes: 'List All Quiz'
        },
        handler: function (request, reply) {
            quizModel.find({}, function (error, data) {
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

    //get quiz by ID
    server.route({
        method: 'GET',
        path: '/quiz/getbyID/{id}',
        config: {
            tags: ['api'],
            description: 'Get specific quiz data',
            notes: 'Get specific quiz data',
            validate: {
                params: {
                    id: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {
            quizModel.find({ _id: request.params.id }, function (error, data) {
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
                            message: 'Quiz Not Found',
                            data: data
                        });
                    } else {
                        reply({
                            statusCode: 200,
                            message: 'Quiz Data Successfully Fetched',
                            data: data
                        });
                    }
                }
            });
        }
    });

    //create quiz
    server.route({
        method: 'POST',
        path: '/quiz/createQuiz',
        config: {
            tags: ['api'],
            description: 'Create Quiz Data',
            notes: 'Add Quiz data',
            validate: {
                payload: {
                    question: Joi.string().required(),
                    choice: Joi.array().required(),
                    correctChoice: Joi.string().required(),
                    learningGroup: Joi.string().required(),
                    classLevel: Joi.string().required(),
                    quizType: Joi.string().required(),
                    difficulty: Joi.string().required(),
                    time: Joi.string().required(),
                    tag: Joi.array(),
                }
            }
        },
        handler: function (request, reply) {
            const quiz = new quizModel(request.payload);
            quiz.save(function (error) {
                if (error) {
                    reply({
                        status: false,
                        statusCode: 503,
                        message: error
                    });
                } else {
                    reply({
                        status: true,
                        statusCode: 201,
                        message: 'Quiz Saved Successfully'
                    });
                }
            });
        }
    });

    //search quiz by keyword
    server.route({
        method: 'GET',
        path: '/quiz/searchbyKeyword/{searchKeyword}',
        config: {
            tags: ['api'],
            description: 'Search Quiz by Keyword',
            notes: 'Search Quiz by Keyword',
            validate: {
                params: {
                    searchKeyword: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {
            quizModel.find({ 'question': { '$regex': request.params.searchKeyword } }, function (error, data) {
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
                            message: 'Quiz Not Found',
                            data: data
                        });
                    } else {
                        reply({
                            statusCode: 200,
                            message: 'Quiz Data Successfully Fetched',
                            data: data
                        });
                    }
                }
            });
        }
    });

    //delete quiz
    server.route({
        method: 'GET',
        path: '/quiz/deleteQuiz/{id}',
        config: {
            tags: ['api'],
            description: 'Remove specific quiz data.',
            notes: 'Remove specific quiz data.',
            validate: {
                params: {
                    id: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            // `findOneAndRemove` is a mongoose methods to remove a particular record into database.
            quizModel.findOneAndRemove({ _id: request.params.id }, function (error) {
                if (error) {
                    reply({
                        status: false,
                        statusCode: 503,
                        message: 'Error in removing Quiz',
                        data: error
                    });
                } else {
                    reply({
                        status: true,
                        statusCode: 200,
                        message: 'Quiz Deleted Successfully'
                    });
                }
            });

        }
    });

    //updata quiz
    server.route({
        method: 'POST',
        path: '/quiz/updateQuiz',
        config: {
            tags: ['api'],
            description: 'Update specific quiz',
            notes: 'Update specific quiz',
            validate: {
                payload: {
                    id: Joi.string().required(),
                    question: Joi.string().required(),
                    choice: {
                        choice1: Joi.string().required(),
                        choice2: Joi.string().required(),
                        choice3: Joi.string(),
                        choice4: Joi.string(),
                    },
                    correctChoice: Joi.string().required(),
                    learningGroup: Joi.string().required(),
                    classLevel: Joi.string().required(),
                    quizType: Joi.string().required(),
                    difficulty: Joi.string().required(),
                    time: Joi.string().required(),
                    timeUnit: Joi.string().required(),
                    tag: Joi.array(),
                }
            }
        },
        handler: function (request, reply) {
            quizModel.findOneAndUpdate({ _id: request.payload.id }, request.payload, function (error, data) {
                if (error) {
                    reply({
                        status: false,
                        statusCode: 503,
                        message: 'Failed to get data',
                        data: error
                    });
                } else {
                    reply({
                        status: true,
                        statusCode: 200,
                        message: 'Quiz Updated Successfully',
                        data: data
                    });
                }
            });

        }
    });

    return next();
};



exports.register.attributes = {
    name: 'routes-quiz'
};

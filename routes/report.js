/**
 * Created by Kanrawee Karaboot on 4/3/2017.
 */
const Joi = require('joi');
const mongoose = require('mongoose');

exports.register = function(server, options, next) {

    const reportModel = require('../models/reportModel');


    return next();
};



exports.register.attributes = {
    name: 'routes-report'
};

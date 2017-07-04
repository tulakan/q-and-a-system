const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({ // new schema
    
});

module.exports = mongoose.model('report', reportSchema, 'report');

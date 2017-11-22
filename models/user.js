const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({ // new schema
    userName: String,
    password: String,
    namePrefix: String,
    firstName: String,
    lastName: String,
    accountType: String,
    parentStudentName: String, // for parent
    deviceUUID: String, //for student
    // status: Number
});
module.exports = mongoose.model('User', UserSchema, 'User');

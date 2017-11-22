const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({ // new schema
    question: String,
    choice: Array,
    correctChoice: String,
    learningGroup: String,
    classLevel: String,
    quizType: String,
    difficulty: String,
    time: String,
    tag: Array,
});

module.exports = mongoose.model('quiz', quizSchema, 'quiz');

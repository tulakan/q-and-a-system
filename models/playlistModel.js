const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({ // new schema
    name: String,
    subject: String,
    learningGroup: String,
    classLevel: String,
    totalTime: Number,
    totalQuiz: Number,
    quizList: Array,
    criterion: String,
    status : Number
  
});

module.exports = mongoose.model('Playlist', PlaylistSchema, 'Playlist');

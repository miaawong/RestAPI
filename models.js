'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sortAnswers = (a, b) => {
    // need to return a negative if a before b 
    // a 0 to leave the order unchanged
    // a positive if a after b 
    if (a.votes === b.votes) {
        return b.updatedAt - a.updatedAt;
    }
    return b.votes - a.votes;
}

const AnswerSchema = new Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 }
});

// create an instance method called updated 
AnswerSchema.method('update', function (updates, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.parent().save(callback);
});

AnswerSchema.method('vote', function (vote, callback) {
    if (vote == "up") {
        this.votes += 1;
    } else {
        this.votes -= 1;
    }
    this.parent().save(callback);
});
const QuestionSchema = new Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    answers: [AnswerSchema]
});
// run code before any save event with pre method 
// to save a child doc in mongoose you have to save its parent doc
// we have to use pre save hook 
QuestionSchema.pre('save', function (next) {
    this.answers.sort(sortAnswers);
    next();
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;


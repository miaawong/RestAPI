'use strict';

const express = require('express');
const router = express.Router();
const Question = require('./models').Question;


router.param("qID", (req, res, next, id) => {
    Question.findById(id, (err, doc) => {
        if (err) return next(err);
        if (!doc) {
            err = new Error('not found');
            err.status(404);
            return next(err);
        }
        req.question = doc;
        return next();
    });
});


router.param("aID", (req, res, next, id) => {
    req.answer = req.question.answers.id(id);
    if (!req.answer) {
        err = new Error('not found');
        err.status(404);
        return next(err);
    }
    next();
});

// GET /questions
// route for questions collection 
router.get('/', (req, res, next) => {
    //return all the questions 
    // we need to add additional params to find the method b4 the callback
    Question.find({})
        .sort({ createdAt: -1 })
        // this executes the query and calls the callback function 
        .exec((err, questions) => {
            if (err) return next(err);
            res.json(questions);
        });
});

// POST /questions 
router.post('/', (req, res, next) => {
    // Route for creating new questions 
    const question = new Question(req.body);
    question.save((err, question) => {
        if (err) return next(err);
        res.status(201);
        res.json(question);
    });
});

// GET /questions/:id
//Route for specific questions 
router.get('/:qID', (req, res, next) => {
    res.json(req.question);
});

// POST /questions/:qid/answers
router.post('/:qID/answers', (req, res, next) => {
    // Route for creating new answers
    req.question.answers.push(req.body);
    req.question.save((err, question) => {
        if (err) return next(err);
        res.status(201);
        res.json(question);
    });
});


// PUT /questions/:qid/answers/:aid
// edit a specific answer 
router.put('/:qID/answers/:aID', (req, res) => {
    req.answer.update(req.body, (err, result) => {
        if (err) return next(err);
        res.json(result);
    });
});

// DELETE /questions/:qid/answers/:aid
// delete a specific answer
router.delete('/:qID/answers/:aID', (req, res) => {
    req.answer.remove((err) => {
        req.question.save((err, question) => {
            if (err) return next(err);
            res.json(question);
        });
    });
});

// POST /questions/:qid/answers/:aid/vote-up
// POST /questions/:qid/answers/:aid/vote-down
// vote on a specific answer
router.post('/:qID/answers/:aID/vote-:dir', (req, res, next) => {
    if (req.params.dir.search(/^(up|down)$/) === -1) {
        const err = new Error('not found,sorry');
        err.status = 404;
        next(err);
    } else {
        req.vote = req.params.dir;
        next();
    }
},
    (req, res, next) => {
        req.answer.vote(req.vote, (err, question) => {
            if (err) return next(err);
            res.json(question);
        });
    });









module.exports = router; 
'use strict';

let express = require('express');
let router = express.Router();

// GET /questions
// route for questions collection 
router.get('/', (req, res) => {
    //return all the questions 
    res.json({
        response: "You sent me a GET request"
    });
});

// POST /questions 
router.post('/', (req, res) => {
    // Route for creating new questions 
    res.json({
        response: "You sent me a POST request",
        body: req.body
    });
});

// GET /questions/:id
//Route for specific questions 
router.get('/:qID', (req, res) => {

    res.json({
        response: "You sent me a GET a request for ID" + req.params.qID
    });
});

// POST /questions/:qid/answers
router.post('/:qID/answers', (req, res) => {
    // Route for creating new answers
    res.json({
        response: "You sent me a POST request to /answers",
        questionId: req.params.qID,
        body: req.body
    });
});

// PUT /questions/:qid/answers/:aid
// edit a specific answer 
router.put('/:qID/answers/:aID', (req, res) => {
    res.json({
        response: "You sent me a PUT request to /answers",
        questionId: req.params.qID,
        answerId: req.params.aID,
        body: req.body
    });
});

// DELETE /questions/:qid/answers/:aid
// delete a specific answer
router.delete('/:qID/answers/:aID', (req, res) => {
    res.json({
        response: "You sent me a DELETE request to /answers",
        questionId: req.params.qID,
        answerId: req.params.aID,
    });
});

// POST /questions/:qid/answers/:aid/vote-up
// POST /questions/:qid/answers/:aid/vote-down
// vote on a specific answer
router.post('/:qID/answers/:aID/vote-:dir', (req, res, next) => {
    if (req.params.dir.search(/^(up|down)$/) === -1) {
        let err = new Error('not found,sorry');
        err.status = 404;
        next(err);
    } else {
        next();
    }
}, (req, res) => {
    res.json({
        response: "You sent me a POST request to /vote-" + req.params.dir,
        questionId: req.params.qID,
        answerId: req.params.aID,
        vote: req.params.dir
    });
});









module.exports = router; 
'use strict'

const express = require('express');
const app = express();
const routes = require('./routes');

const jsonParser = require('body-parser').json;
const logger = require('morgan');

/* when the app receives a request, jsonParser will parse the request 
body as JSON and make it accessible from the request's body property */
app.use(logger("dev"));
app.use(jsonParser());

const mongoose = require('mongoose');

//connecting to mongoose db server 
mongoose.connect('mongodb://localhost:27017/qa');

const db = mongoose.connection;

db.on('error', (err) => {
    console.log('uh oh there was an error!', err);
});
//listen for open event 
// using 'once' method to listen for it, it is like the 'on' method
// except it fires its handler the first time the event occurs. not everytime (like 'on')
db.once('open', () => {
    console.log('db connection successful');
});
//for setting up your API to grant access to the resources from domain 
// when you set up your API to be used by a web browser. 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
    }
    next();
});
// /questions is where to start 
app.use('/questions', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Sorry could not be found");
    err.status = 404;
    next(err);
});

//ERROR Handler 
// has four params so JS knows this isn't a middleware but an error handler 
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

// setting up the server 
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on port', port);
}); 
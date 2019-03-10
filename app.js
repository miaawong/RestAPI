'use strict'

let express = require('express');
let app = express();
let routes = require('./routes');

let jsonParser = require('body-parser').json;
let logger = require('morgan');

/* when the app receives a request, jsonParser will parse the request 
body as JSON and make it accessible from the request's body property */
app.use(logger("dev"));
app.use(jsonParser());


// /questions is where to start 
app.use('/questions', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error("Sorry could not be found");
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
let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on port', port);
}); 
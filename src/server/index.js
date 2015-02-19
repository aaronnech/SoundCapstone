var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

var config = require('./config');

// Connect to database
mongoose.connect(config.db.url);

mongoose.connection.on('error', function(err) {
    console.log("mongodb error:");
    console.log(err);
    process.exit(1);
});

mongoose.connection.on('open', function () {
    // Express middleware
    app.use(cookieParser());
    app.use(session({
        secret : '!!SUPERSECR3T!!!',
        saveUninitialized: true,
        resave: true
    }));
    app.use(bodyParser.json({limit: '50mb', parameterLimit: 100000}));
    app.use(bodyParser.urlencoded({parameterLimit: 10000000, limit: '50mb', extended: true }));

    // Middleware for static serving
    app.use('/therapist', express.static(__dirname + '/../therapist'));
    app.use('/game', express.static(__dirname + '/../game'));


    // Setup routes
    var recordings = require('./routes/recordings');
    var children = require('./routes/children');
    var users = require('./routes/users');

    // Route connections
    app.post('/api/user/register', users.register);
    app.post('/api/user/login', users.login);
    app.get('/api/user', users.isAuthenticated, users.getUser);
    app.post('/api/child/add', users.isAuthenticated, children.add);
    app.get('/api/child', users.isAuthenticated, children.getMyChildren);
    app.post('/api/recording/add', recordings.hasChildId, recordings.add);
    app.get('/api/recording', users.isAuthenticated, recordings.getRecording);

    app.listen(1337);

    console.log('Listening on port 1337...');
});



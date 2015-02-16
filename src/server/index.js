var express = require('express');
var mongoose = require('mongoose');
var app = express();

var config = require('./config');

// Connect to database
mongoose.connect(config.db.url);
mongoose.connection.on('error', function(err) {
    console.log("mongodb error:");
    console.log(err);
    process.exit(1);
});


// Express middleware
app.use(bodyParser.json());
app.use('/therapist', express.static(__dirname + '/../therapist'));
app.use('/game', express.static(__dirname + '/../game'));


// Setup routes
var users = require('./routes/users');

app.post('/api/user/register', users.register);
app.post('/api/user/login', users.login);

app.listen(1337);

console.log('Listening on port 1337...');
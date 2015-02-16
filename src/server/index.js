var express = require("express");
var app = express();

app.use('/therapist', express.static(__dirname + '/../therapist'));
app.use('/game', express.static(__dirname + '/../game'));

app.listen(1337);

console.log('Listening on port 1337...');
var config = require('./config');
var fs = require('fs');
var speech = require('google-speech-api');

function usage() {
	console.log('Usage: ---- TODO --- ');
	process.exit(1);
}


if (process.argv.length != 4) {
	usage();
}

var inFile = process.argv[2];
var outFile = process.argv[3];

var opts = {
  file: inFile,
  key: config.GOOGLE_API_KEY
};

speech(opts, function (err, results) {
	fs.writeFile(outFile, results, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved! Done.");
	    }
	});
});
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
console.log(inFile);
console.log(outFile);
console.log(config.GOOGLE_API_KEY);

var opts = {
  file: inFile,
  key: config.GOOGLE_API_KEY
};

console.log(opts);

speech(opts, function (err, results) {
	if (err) {
		console.log('API ERROR: ');
		console.log(err);
	} else {
		console.log(JSON.stringify(results));
		fs.writeFile(outFile, JSON.stringify(results[0].result), function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was saved! Done.");
		    }
		});
	}
});
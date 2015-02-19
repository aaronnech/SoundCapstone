var Child = require('../model/Child');
var Recording = require('../model/Recording');
var users = require('./users');

// Middleware that checks for the existence of a childId
// In the request.
exports.hasChildId = function(req, res, next) {
    if (req.body.childId) {
        next();
    } else {
        console.log('no child id!');
        res.json({error : 'No child id'});
    }
};

var writeUTFBytes = function(view, offset, string){
    var lng = string.length;
    for (var i = 0; i < lng; i++){
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

var interleave = function(leftChannel, rightChannel){
    var length = leftChannel.length + rightChannel.length;
    var result = new Float32Array(length);

    var inputIndex = 0;

    for (var index = 0; index < length; ){
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
    }
    return result;
};

var mergeBuffers = function(channelBuffer, recordingLength){
    var result = new Float32Array(recordingLength);
    var offset = 0;
    var lng = channelBuffer.length;
    for (var i = 0; i < lng; i++){
        var buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
    }
    return result;
};


var getWav = function(rawBufs) {
    var recordingLength = 4096 * rawBufs.length;
    console.log(rawBufs.length);
    console.log(recordingLength);

    var leftChannel = rawBufs.map(function(LR) {
        return LR[0];
    });

    var rightChannel = rawBufs.map(function(LR) {
        return LR[1];
    });

    console.log("CHANNEL LENGTH: " + leftChannel.length);

    // we flat the left and right channels down
    var leftBuffer = mergeBuffers(leftChannel, recordingLength);
    var rightBuffer = mergeBuffers(rightChannel, recordingLength);

    // we interleave both channels together
    var interleaved = interleave(leftBuffer, rightBuffer);

    console.log("INTERLEAVED LENGTH: " + interleaved.length);

    // create the buffer and view to create the .WAV file
    var buffer = new ArrayBuffer(44 + interleaved.length * 2);
    var view = new DataView(buffer);

    // write the WAV container, check spec at: https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
    // RIFF chunk descriptor
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + interleaved.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    view.setUint32(24, 44100, true);
    view.setUint32(28, 44100 * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    // data sub-chunk
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    // write the PCM samples
    var lng = interleaved.length;
    var index = 44;
    var volume = 1;
    for (var i = 0; i < lng; i++){
        view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
        index += 2;
    }

    return view;
};

var toBuffer = function(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
};

// Gets a specific recording
exports.getRecording = function(req, res) {
    users.getLoggedIn(req, res, function(user) {
        console.log(req.params);
        console.log(req.body);
        Recording.findById({_id : req.params.id, _therapist : user._id}, function(err, recording) {
            if (err || !recording) {
                console.log(err);
                res.json({error: 'Error getting recording'});
            } else {
                res.json({recording : recording, success : true});
            }
        });
    });
};

// Adds a recording
exports.add = function(req, res) {
    Child.findOne({token : req.body.childId}, function(err, child) {
        if (err || !child) {
            console.log(err);
            res.json({error : 'Error saving recording'});
        } else {
            var wavFile = getWav(req.body.raw);
            var buffer = toBuffer(wavFile.buffer);
            var recording = new Recording({
                'raw' : buffer,
                'word' : req.body.word,
                '_therapist' : child._therapist
            });

            // Push recording into child and save
            child.recordings.push(recording);
            recording.save(function(err) {
                if (err) {
                    console.log(err);
                    res.json({error: 'Error saving recording'});
                } else {
                    child.save(function(err) {
                        if (err) {
                            console.log(err);
                            res.json({error: 'Error saving recording'});
                        } else {
                            res.json({success : true});
                        }
                    });
                }
            });
        }
    });
};
var User = require('../model/User');
var Child = require('../model/Child');

var users = require('./users');
var uuid = require('node-uuid');

// Adds a child to the current logged in user
exports.add = function(req, res) {
    console.log('adding child');

    users.getLoggedIn(req, function(err, user) {
        if (!err && user) {
            var token = uuid.v1();
            var child = new Child({
                '_therapist' : user._id,
                'name' : req.body.name,
                'token' : token
            });

            child.save(function(err) {
                if (err) {
                    console.log(err);
                    res.json({error : 'Error adding child'});
                } else {
                    res.json({child : child, success : true});
                }
            });
        }
    });
};

// Decorates an array of children with a histogram of word recordings
var decorateWords = function(children) {
    var result = new Array(children.length);
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        result[i] = {};

        for (var j = 0; j < child.recordings.length; j++) {
            var recording = child.recordings[j];
            if (!result[i][recording.word]) {
                result[i][recording.word] = [];
            }

            result[i][recording.word].push(recording);
        }
    }

    return result;
};


// Gets the children from current logged in user
exports.getMyChildren = function(req, res) {
    users.getLoggedIn(req, function(err, user) {
        if (!err && user) {
            Child.find({'_therapist' : user._id})
                 .populate('recordings')
                 .exec(function(err, children) {
                            if (err) {
                                console.log(err);
                                res.json({error : 'Error getting children'});
                            } else {
                                recordings = decorateWords(children);
                                res.json({children : children, recordingMap : recordings, success : true});
                            }
                });
        }
    });
};
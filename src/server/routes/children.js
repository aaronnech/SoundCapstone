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
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        child.words = {};

        for (var j = 0; j < child.recordings.length; j++) {
            var recording = child.recordings[i];
            if (!child.words[recording.word]) {
                child.words[recording.word] = [];
            }

            child.words[recording.word].push(recording);
        }
    }
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
                                decorateWords(children);
                                res.json({children : children, success : true});
                            }
                });
        }
    });
};
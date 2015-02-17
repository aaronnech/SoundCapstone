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
                    res.json({childId : token, success : true});
                }
            });
        }
    });
};


// Gets the children from current logged in user
exports.getMyChildren = function(req, res) {
    users.getLoggedIn(req, function(err, user) {
        if (!err && user) {
            Child.find({'_therapist' : user._id}, function(err, children) {
                if (err) {
                    console.log(err);
                    res.json({error : 'Error getting children'});
                } else {
                    res.json({children : children, success : true});
                }
            });
        }
    });
};

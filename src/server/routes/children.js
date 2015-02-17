var User = require('../model/User');
var Child = require('../model/Child');

var users = require('./users');

// Adds a child to the current logged in user
exports.add = function(req, res) {
    users.getLoggedIn(function(err, user) {
        if (!err && user) {
            var child = new Child({
                '_therapist' : user._id,
                'name' : req.body.name
            });

            child.save(function(err) {
                if (err) {
                    console.log(err);
                    res.json({error : 'Error adding child'});
                } else {
                    res.json({childId : "foo(will generate)", success : true});
                }
            });
        }
    });
};

var User = require('../model/User');
var md5 = require('MD5');

// Gets the current logged in user
exports.getLoggedIn = function(req, callback) {
    User.findOne({
        'email' : req.session.email
    }, function(err, user) {
        if (err || !user) {
            console.log(err);
            callback(err, null);
        } else {
            callback(err, user);
        }
    });
};

// Middleware returns true if the user is authenticated
exports.isAuthenticated = function(req, res, next) {
    console.log('checking authentication');
    if (req.session.email != undefined) {
        console.log('passed auth');
        next();
    } else {
        console.log('passed failed auth. Sending response');
        res.json({error : "not logged in", notAuth : true});
    }
};

// Registers a user
exports.register = function(req, res) {
    var user = new User({
        'email' : req.body.email,
        'password' : md5(req.body.password)
    });

    user.save(function(err) {
        if (err) {
            console.log(err);
            res.json({error : 'Error registering'});
        } else {
            req.session.email = user.email;
            res.json({email : user.email, success : true});
        }
    });
};

// Logs in a user
exports.login = function(req, res) {
    User.findOne({
        'email' : req.body.email
    }, function(err, user) {
        if (err || !user) {
            console.log(err);
            res.json({error : 'incorrect password / username'});
        } else {
            if (user.password == md5(req.body.password)) {
                // Login successful. Set session
                req.session.email = user.email;
                res.json({email : user.email, success : true});
            } else {
                res.json({error : 'incorrect password / username'});
            }
        }
    });
};

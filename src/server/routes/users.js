var User = require('../model/User');
var md5 = require('MD5');

exports.isAuthenticated = function(req, res) {
    return req.session.email != undefined;
};

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
